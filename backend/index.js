/*
? conexiones y requests para la db
*/

//* constantes necesarias para conectar todo
const express = require("express"); //crea el servidor y sus rutas
const MongoClient = require("mongodb").MongoClient; // cliente para conectarse a MongoDB
var cors = require("cors") // deja que el frontend haga peticiones a este servidor
const bodyParser = require("body-parser") 
const argon2 = require("argon2") 
const jwt = require("jsonwebtoken") //tokens de sesión
const fs = require("fs"); // lee  el server.key y server.crt
const https = require('https'); 
const {hashear, revisarContrasena, generarClaveAcceso} = require("./seguridad");
const {registrarRutas} = require("./rutas"); // rutas de las colecciones 
process.loadEnvFile(".env"); // jala el .env con todas las credenciales
const app = express(); 
let db; //para guardar la conexion a la db
const PORT = process.env.PORT; 
app.use(cors()); 
app.use(bodyParser.json()); 

//* datos generales de la db, los puse acá por si despues quieren cambiar los permisos
const PUEDEN_ESCRIBIR={
	usuarios: ["admin"],
	estancias: ["admin"],
	tutores: ["admin"],
	infantes: ["admin", "estancia"],
	mediciones: ["admin", "estancia"],
};

//* conexion con la db usando los datos de env por seguridad
async function connectToDB(){
	let client = new MongoClient(process.env.DB);
	await client.connect();
	db = client.db();
	console.log("Conectado a la base de datos :)");
}

//* campos para la bitacora, se lleva en el server
async function log(sujeto, accion, objeto){
	let nuevoLog = {}
	nuevoLog["timestamp"] = new Date();
	nuevoLog["sujeto"] = sujeto;
	nuevoLog["accion"] = accion;
	nuevoLog["objeto"] = objeto;
	await db.collection("log").insertOne(nuevoLog);

}

//* revisa el token y guarda los datos de la sesión en req.sesion
// está como función ya que lo usamos para revisar que la persona en sesión tenga los permismos
async function verificarToken(req, res, next){
	try{
		let token = req.get("Authentication");
		req.sesion = jwt.verify(token, process.env.LLAVEJWT);
		next();
	}catch{
		res.sendStatus(401); //es unauthorized
	}
}

//* revisa si el rol de la sesión puede crear o editar en esa colección
function puedeEscribir(sesion, coleccion){
	return PUEDEN_ESCRIBIR[coleccion].includes(sesion.rol);
}

//* filtrado por rol: regresa un filtro de mongoDB con lo que la sesión tiene permitido ver
async function alcance(sesion, coleccion){
	if (sesion.rol == "admin"){ //^ admin ve todo, regresa un filtro sin filtro 
		return {};
	}

	if (sesion.rol == "tutor"){ //^ tutor solo sus hijos e hijas
		let tutor = await db.collection("tutores").findOne({id: sesion.id});
		let infanteIds = tutor.infanteIds;
		if (coleccion == "infantes"){
			return {id: {$in: infanteIds}}; //cualquiera de la lista de los ids 
		}
		if (coleccion == "mediciones"){
			return {infanteId: {$in: infanteIds}};
		}
		if (coleccion == "tutores"){
			return {id: sesion.id}; // solo él mismo
		}
		if (coleccion == "estancias"){ //las estancias donde están sus hijos
			let infantes = await db.collection("infantes").find({id: {$in: infanteIds}}).toArray();
			let estanciaIds = [];
			for (let i = 0; i < infantes.length; i++){
				estanciaIds.push(infantes[i].estanciaId);
			}
			return {id: {$in: estanciaIds}};
		}
		return {id: -1}; //el tutor pide usuarios y no tiene acceso a eso, se le manda -1 ya que ese no exitse
	}

	//^ para coordinador y personal de estancia primero se buscan las estancias que les tocan
	let estanciaIds = [];
	if (sesion.rol == "coordinador"){
 		let estancias = await db.collection("estancias").find({region: sesion.region}).toArray();
		for (let i = 0; i < estancias.length; i++){  //todas las de su region
			estanciaIds.push(estancias[i].id);
		}
	} else if (sesion.rol == "estancia"){  //solo puede ver la suya
		estanciaIds.push(sesion.estanciaId);
	}

	if (coleccion == "estancias"){
		return {id: {$in: estanciaIds}};
	}
	if (coleccion == "infantes"){
		return {estanciaId: {$in: estanciaIds}};
	}
	if (coleccion == "usuarios"){
		return {id: sesion.id}; // solo él mismo
	}

	let infantes = await db.collection("infantes").find({estanciaId: {$in: estanciaIds}}).toArray();
	let infanteIds = [];
	let tutorIds = [];
	for (let i = 0; i < infantes.length; i++){
		infanteIds.push(infantes[i].id);
		tutorIds.push(infantes[i].tutorId);
	}
	if (coleccion == "mediciones"){
		return {infanteId: {$in: infanteIds}};
	}
	return {id: {$in: tutorIds}}; // tutores
}

//& funciones para leer y escribir en la db
//* filtro con lo que la persona pidio en la URL
function filtroDeConsulta(query){
	let filtro = {...query}; // copia, para no modificar req.query
	//se quitan para que mongodb no los tome como campos 
	delete filtro._sort;
	delete filtro._order;
	delete filtro._start;
	delete filtro._end;
	delete filtro.q;
	//luego el numero se pasa de texto plano a numero 
	for (let campo in filtro){  //se revisan los campos que quedaron 
		let esId = campo == "id" || campo.endsWith("Id"); //si dice lit id o termina en id como estanciaid, es id xd
		if (Array.isArray(filtro[campo])){ //caso 1: si el campo actual tiene varios ids
			let valores = [];
			for (let i = 0; i < filtro[campo].length; i++){ //los metemos a valores 
				if (esId){
					valores.push(Number(filtro[campo][i])); //como numeros si son id
				} else {
					valores.push(filtro[campo][i]);  //como están si son otra cosa
				}
			}
			filtro[campo] = {$in: valores};
		} else if (esId){ // caso 2: llegó un solo id. 
			filtro[campo] = Number(filtro[campo]);
		}
	}
	return filtro; //caso 3: pidio otra cosa que no era id entonces se regresa normal o lo que se hizo en caso 1 o 2
}

//* lista de registros, sirve para getList, getMany y getManyReference 
async function getList(coleccion, req, res){
	//? $and pide que se tengan que cumplir los dos filtros, lo que pidió y lo que tiene permitido
	let filtro = {$and: [filtroDeConsulta(req.query), await alcance(req.sesion, coleccion)]};
	let sorter = {}
	if (req.query._sort){
		sorter[req.query._sort] =req.query._order == "DESC" ? -1:1; //-1 = reciente -> vieja, 1 = vieja -> recientye
	}
	let data = await db.collection(coleccion).find(filtro).sort(sorter).project({_id:0, passwordHash:0}).toArray();
	res.set("Access-Control-Expose-Headers", "X-Total-Count");  //ocupa saber cuantos datos para saber como va a partir la tabla
	res.set("X-Total-Count", data.length);
	if (req.query._start != undefined){  //si en el query trae un filtro de donde iniciar a donde terminar
		data = data.slice(Number(req.query._start), Number(req.query._end));
	}
	res.json(data);  //regresa la data filtrada
}

//* un registro por id.
async function getOne(coleccion, id, req, res){
	let filtro = {$and: [{id: id}, await alcance(req.sesion, coleccion)]};  //se busca el id y se confirma que tenga accesos a esa info
	let data = await db.collection(coleccion).findOne(filtro, {projection: {_id:0, passwordHash:0}});
	if (data == null){
		res.sendStatus(404); //no encontrado
	} else {
		res.json(data);
	}
}

//* siguiente id libre de una colección porque react-admin no lo manda al crear
async function nuevoId(coleccion){
	let ultimo = await db.collection(coleccion).find().sort({id:-1}).limit(1).toArray();
	return ultimo.length == 0 ? 1 : ultimo[0].id + 1;
}

//* clave de acceso que no tenga otro tutor, para que no se repitan, raro pero puede pasar
async function claveAccesoNueva(){
	let clave = generarClaveAcceso(); //(seguridad.js)
	while (await db.collection("tutores").findOne({claveAcceso: clave}) != null){
		clave = generarClaveAcceso();
	}
	return clave;
}

//* crea un registro nuevo con los datos del formulario (req.body)
async function createData(coleccion, req, res){
	let valores = {...req.body}; // copia de lo que mandó el formulario
	//se borran los datos que solo pone el server, para evitar que alguien le mueva
	delete valores._id; // id interno de MongoDB
	delete valores.id; // lo pone nuevoId
	delete valores.passwordHash; // solo se crea con hashear (seguridad.js)
	delete valores.password; // la contraseña en texto plano nunca se guarda
	delete valores.claveAcceso; // la genera claveAccesoNueva 
	let respuestaExtra={};

	if (coleccion == "usuarios"){ //el admin quiere crear un nuevo usuario de personal
		let error = revisarContrasena(String(req.body.password || ""));
		if (error) 
			return res.status(400).json({message: error});  //datos no validos
		valores.passwordHash = await hashear(req.body.password); //se guarda el hash
	}

	if (coleccion == "mediciones"){ // el personal toma las medidas de un infante
		valores.infanteId = Number(valores.infanteId);
		// revisa que el infante este dentro de las estancias que tiene acceso la sesion
		let infante = await db.collection("infantes").findOne({$and: [{id: valores.infanteId}, await alcance(req.sesion, "infantes")]});
		if (infante == null)  // no existe el infante dentro de las estancias que tiene la sesion
			return res.sendStatus(403); //prohibido
		valores.registradoPor = req.sesion.id; //para el log
	}

	if (coleccion == "infantes"){ // se da de alta un infante nuevo
		if (req.sesion.rol == "estancia") {
			valores.estanciaId = req.sesion.estanciaId;
		}
		valores.id = await nuevoId("infantes");
		if (valores.tutorId){  // si ya existe ese tutor, quiere decir que es son parientes, por lo que se asiga el mismo tutor
			valores.tutorId = Number(valores.tutorId);
			await db.collection("tutores").updateOne({id: valores.tutorId}, {$push: {infanteIds: valores.id}});
		} else { // es una familia nueva, entonces se crea su cuenta con una clave de acceso. 
			let tutor = {
				id: await nuevoId("tutores"),
				nombre: valores.tutorNombre,
				ciudad: valores.tutorCiudad,
				claveAcceso: await claveAccesoNueva(), //para que después puedan acceder con esa
				passwordHash: null,  //se hace hasta que el tutor hace su contraseña
				infanteIds: [valores.id],
			};
			await db.collection("tutores").insertOne(tutor);
			valores.tutorId = tutor.id;
			respuestaExtra.claveAcceso = tutor.claveAcceso; // la clave solo se regresa esta vez, para entregársela a la familia
		}
		delete valores.tutorNombre; //estos datos se borran porque ya estan en los datos del tutor y no van en los registros de infates
		delete valores.tutorCiudad;
	} else {
		valores.id = await nuevoId(coleccion);  //id del registro que se está creando
	}

	await db.collection(coleccion).insertOne(valores);  //guarda
	delete valores._id;  //se borran los datos que no se deben mandar al navegador
	delete valores.passwordHash;
	res.json({...valores, ...respuestaExtra});  //regresa la info necesaria unicamente
}

//* edita el registro con ese id usando los datos del formulario 
async function updateData(coleccion, id, req, res){
	let filtro = {$and: [{id: id}, await alcance(req.sesion, coleccion)]}; //que el id exista y que la sesion tenga permiso
	if (await db.collection(coleccion).findOne(filtro) == null){
		return res.sendStatus(404); //no encontrado el filtro que se quiere modificar
	}
	let valores = {...req.body}; // copia de lo que mandó el formulario
	//borra los datos que solo debe hace el server
	delete valores._id;
	delete valores.id; // el id es el de la URL, no se puede cambiar
	delete valores.passwordHash;
	delete valores.password;
	delete valores.claveAcceso;
	//^ el personal de estancia no puede pasar registros a otra estancia, ni cambiar de quién es una medición
	if (req.sesion.rol == "estancia"){
		delete valores.estanciaId;
		delete valores.infanteId;
	}
	await db.collection(coleccion).updateOne({id: id}, {"$set": valores});
	let data = await db.collection(coleccion).findOne({id: id}, {projection: {_id:0, passwordHash:0}});
	res.json(data);
}

//& opciones de inicio de sesión, que la cuenta exista o primera vez de tutores 
//* login
app.post("/login", async(req, res) => {
	let user = String(req.body.username || "").trim();
	let pwd = String(req.body.password || "");
	let sesion;
	let cuenta;
//^ paso 1: revisar la cuenta que quiere entrar (username)
	if (user.includes("@")){  //si tiene @ es parte del personal del issste, las familias no tienen @
		cuenta = await db.collection("usuarios").findOne({email: user.toLowerCase(), activo: true});
		if (cuenta) // revisa si existe la cuenta y se guarda la sesion para el log
			sesion = {id: cuenta.id, rol: cuenta.rol, nombre: cuenta.nombre, estanciaId: cuenta.estanciaId, region: cuenta.region};
	} else {
		cuenta = await db.collection("tutores").findOne({claveAcceso: user.toUpperCase()});
		if (cuenta) 
			sesion = {id: cuenta.id, rol: "tutor", nombre: cuenta.nombre};
	}
	if (cuenta == null){ //la cuenta no existe
		return res.sendStatus(401); //unathorized
	}

//^paso 2: revisar la contraseña
	if (cuenta.passwordHash == null){ // tutor que todavía no crea su contraseña, se le manda a la screen "primer acceso"
		return res.status(403).json({message: "primer_acceso"});  //prohibido y la notificacion del primer acceso
	}
	if (await argon2.verify(cuenta.passwordHash, pwd)){
		let token = jwt.sign(sesion, process.env.LLAVEJWT, {expiresIn: "1h"});  //se crea un token para la sesion
		await log(sesion.nombre, "iniciar sesión", "/login");  //se registra en bitacora
		res.json({token: token, ...sesion});
	} else {
		res.sendStatus(401); //unauthorized, el hash guardado no empata con el nuevo
	}
})

//* primer acceso: la familia usa su clave para crear su contraseña
app.post("/primer-acceso", async(req, res)=>{
	let clave = String(req.body.claveAcceso || "").trim().toUpperCase();
	let pwd = String(req.body.password || "");
	let tutor = await db.collection("tutores").findOne({claveAcceso: clave});
	if (tutor == null || tutor.passwordHash != null){  //^ caso 1: no existe ese tutor o ya tiene contraseña
		return res.sendStatus(403); //prohibido
	}
	let error = revisarContrasena(pwd);
	if (error){
		return res.status(400).json({message: error}); //bad request, o sea que no puede procesar la peticion por la sintaxis
	}
	//^ caso 2: el tutor existe y es su primera vez, se guarda su contraseña
	await db.collection("tutores").updateOne({id: tutor.id}, {"$set": {passwordHash: await hashear(pwd)}});
	await log(tutor.nombre, "crear contraseña", "/primer-acceso");  //se registra que ya va a tener contraseña
	res.sendStatus(201); //creado
})

//& rutas de las colecciones (están en rutas.js)
registrarRutas(app, {verificarToken, puedeEscribir, log, getList, getOne, createData, updateData});

const options = {
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.crt')
};

https.createServer(options, app).listen(PORT, async () => {
		await connectToDB();
      	console.log('HTTPS Server running on port ' + PORT);
});

