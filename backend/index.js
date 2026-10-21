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
const COLECCIONES=["usuarios", "tutores", "estancias", "infantes", "mediciones"];
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


const options = {
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.crt')
};

https.createServer(options, app).listen(PORT, async () => {
		await connectToDB();
      	console.log('HTTPS Server running on port ' + PORT);
});

