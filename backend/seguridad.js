/*
? funciones de seguridad
*/

const argon2 = require("argon2");
const crypto = require("crypto");

//* convierte la contraseña en un hash
function hashear(pwd){
	//recibe la contraseña del usuario y la config que usara argon2 para el hashing
	return argon2.hash(pwd, {type:argon2.argon2id, memoryCost: 64*1024, timeCost:3, parallelism:1, saltLength:128});
};

//* reglas de contraseña
/* asi aseguramos que los usuarios tengan el primer paso de seguridad bien hecho, regresa
null si la contraseña cumple todo o el error dependiendo de que falte*/
function revisarContrasena(pwd){
	if(pwd.length < 8) 
		return "La contraseña debe tener al menos 8 caracteres.";
	if(!/[A-Z]/.test(pwd)) 
		return "La contraseña debe tener al menos una mayúscula.";
	if(!/[a-z]/.test(pwd)) 
		return "La contraseña debe tener al menos una minúscula.";
	if(!/[0-9]/.test(pwd)) 
		return "La contraseña debe tener al menos un número.";
	if(!/[^A-Za-z0-9]/.test(pwd)) 
		return "La contraseña debe tener al menos un carácter especial.";
	return null;
};

//* genera una clave de acceso para las familias, por ejemplo PI-7K3M9Q
function generarClaveAcceso(){
	const caracteres="ABCDEFGHJKMNPQRSTUVWXYZ23456789";
	let clave="ID-";
	for(let i=0; i<6; i++){
		//hace una clave con chars aleatorios para que las familias entren
		clave+=caracteres[crypto.randomInt(caracteres.length)];
	}
	return clave;
};

//* funciones que usa index.js 
module.exports = {hashear, revisarContrasena, generarClaveAcceso};
