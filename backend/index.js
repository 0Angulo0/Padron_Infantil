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
process.loadEnvFile(".env"); // jala el .env con todas las credenciales
const app = express(); 
let db; //para guardar la conexion a la db
const PORT = process.env.PORT; 
app.use(cors()); 
app.use(bodyParser.json()); 

//* datos generales de la db, los puse acá por si despues quieren cambiar los permisos o las colecciones
const PUEDEN_ESCRIBIR={
	usuarios: ["admin"],
	estancias: ["admin"],
	tutores: ["admin"],
	infantes: ["admin", "estancia"],
	mediciones: ["admin", "estancia"],
};
const OCULTOS={_id:0, passwordHash:0}; //este no cambiar por seguridad :)

//* conexion con la db usando los datos de env por seguridad
async function connectToDB(){
	let client = new MongoClient(process.env.DB);
	await client.connect();
	db = client.db();
	console.log("Conectado a la base de datos :)");
}

//* campos para la bitacora (log), se lleva en el server
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

//& rutas de las colecciones, todas piden token por seguridad

//* usuarios
app.get("/usuarios", verificarToken, async (req, res)=>{
	await log(req.sesion.nombre, "consultar datos", "/usuarios");
	await getList("usuarios", req, res);
});

app.get("/usuarios/:id", verificarToken, async (req, res)=>{
	await log(req.sesion.nombre, "consultar registro", "/usuarios/"+req.params.id);
	await getOne("usuarios", Number(req.params.id), req, res);
});

app.post("/usuarios", verificarToken, async (req, res)=>{
	if(!puedeEscribir(req.sesion, "usuarios")) return res.sendStatus(403);
	await log(req.sesion.nombre, "crear registro", "/usuarios");
	await createData("usuarios", req, res);
});

app.put("/usuarios/:id", verificarToken, async (req, res)=>{
	if(!puedeEscribir(req.sesion, "usuarios")) return res.sendStatus(403);
	await log(req.sesion.nombre, "editar registro", "/usuarios/"+req.params.id);
	await updateData("usuarios", Number(req.params.id), req, res);
});

//* tutores
app.get("/tutores", verificarToken, async (req, res)=>{
	await log(req.sesion.nombre, "consultar datos", "/tutores");
	await getList("tutores", req, res);
});

app.get("/tutores/:id", verificarToken, async (req, res)=>{
	await log(req.sesion.nombre, "consultar registro", "/tutores/"+req.params.id);
	await getOne("tutores", Number(req.params.id), req, res);
});

app.post("/tutores", verificarToken, async (req, res)=>{
	if(!puedeEscribir(req.sesion, "tutores")) return res.sendStatus(403);
	await log(req.sesion.nombre, "crear registro", "/tutores");
	await createData("tutores", req, res);
});

app.put("/tutores/:id", verificarToken, async (req, res)=>{
	if(!puedeEscribir(req.sesion, "tutores")) return res.sendStatus(403);
	await log(req.sesion.nombre, "editar registro", "/tutores/"+req.params.id);
	await updateData("tutores", Number(req.params.id), req, res);
});

//* estancias
app.get("/estancias", verificarToken, async (req, res)=>{
	await log(req.sesion.nombre, "consultar datos", "/estancias");
	await getList("estancias", req, res);
});

app.get("/estancias/:id", verificarToken, async (req, res)=>{
	await log(req.sesion.nombre, "consultar registro", "/estancias/"+req.params.id);
	await getOne("estancias", Number(req.params.id), req, res);
});

app.post("/estancias", verificarToken, async (req, res)=>{
	if(!puedeEscribir(req.sesion, "estancias")) return res.sendStatus(403);
	await log(req.sesion.nombre, "crear registro", "/estancias");
	await createData("estancias", req, res);
});

app.put("/estancias/:id", verificarToken, async (req, res)=>{
	if(!puedeEscribir(req.sesion, "estancias")) return res.sendStatus(403);
	await log(req.sesion.nombre, "editar registro", "/estancias/"+req.params.id);
	await updateData("estancias", Number(req.params.id), req, res);
});

//* infantes
app.get("/infantes", verificarToken, async (req, res)=>{
	await log(req.sesion.nombre, "consultar datos", "/infantes");
	await getList("infantes", req, res);
});

app.get("/infantes/:id", verificarToken, async (req, res)=>{
	await log(req.sesion.nombre, "consultar registro", "/infantes/"+req.params.id);
	await getOne("infantes", Number(req.params.id), req, res);
});

app.post("/infantes", verificarToken, async (req, res)=>{
	if(!puedeEscribir(req.sesion, "infantes")) return res.sendStatus(403);
	await log(req.sesion.nombre, "crear registro", "/infantes");
	await createData("infantes", req, res);
});

app.put("/infantes/:id", verificarToken, async (req, res)=>{
	if(!puedeEscribir(req.sesion, "infantes")) return res.sendStatus(403);
	await log(req.sesion.nombre, "editar registro", "/infantes/"+req.params.id);
	await updateData("infantes", Number(req.params.id), req, res);
});

//* mediciones
app.get("/mediciones", verificarToken, async (req, res)=>{
	await log(req.sesion.nombre, "consultar datos", "/mediciones");
	await getList("mediciones", req, res);
});

app.get("/mediciones/:id", verificarToken, async (req, res)=>{
	await log(req.sesion.nombre, "consultar registro", "/mediciones/"+req.params.id);
	await getOne("mediciones", Number(req.params.id), req, res);
});

app.post("/mediciones", verificarToken, async (req, res)=>{
	if(!puedeEscribir(req.sesion, "mediciones")) return res.sendStatus(403);
	await log(req.sesion.nombre, "crear registro", "/mediciones");
	await createData("mediciones", req, res);
});

app.put("/mediciones/:id", verificarToken, async (req, res)=>{
	if(!puedeEscribir(req.sesion, "mediciones")) return res.sendStatus(403);
	await log(req.sesion.nombre, "editar registro", "/mediciones/"+req.params.id);
	await updateData("mediciones", Number(req.params.id), req, res);
});

const options = {
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.crt')
};

https.createServer(options, app).listen(PORT, async () => {
		await connectToDB();
      	console.log('HTTPS Server running on port ' + PORT);
});

