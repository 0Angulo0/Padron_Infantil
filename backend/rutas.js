/*
? endpoints de las colecciones
- Cada colección tiene 4 rutas: lista, un registro, crear y editar.
*/

//* index.js llama a esta función y le pasa la app y las funciones que usan las rutas
function registrarRutas(app, {verificarToken, puedeEscribir, log, getList, getOne, createData, updateData}){

	//* usuarios
	// lista de usuarios, la pantalla de lista de react-admin
	app.get("/usuarios", verificarToken, async (req, res)=>{
		await log(req.sesion.nombre, "consultar datos", "/usuarios");  //para registro de la bitacora
		await getList("usuarios", req, res); //busca y regresa al navergador el json
	});

	// un solo usuario
	app.get("/usuarios/:id", verificarToken, async (req, res)=>{
		await log(req.sesion.nombre, "consultar registro", "/usuarios/" + req.params.id); //bitacora 
		await getOne("usuarios", Number(req.params.id), req, res);  //busca y manda
	});

	// crear un usuario 
	app.post("/usuarios", verificarToken, async (req, res)=>{
		if (!puedeEscribir(req.sesion, "usuarios"))  //el usuario de la sesion no tiene permiso para crear
			return res.sendStatus(403);  //prohibido
		await log(req.sesion.nombre, "crear registro", "/usuarios");
		await createData("usuarios", req, res);
	});

	// editar el usuario con ese id,
	app.put("/usuarios/:id", verificarToken, async (req, res)=>{
		if (!puedeEscribir(req.sesion, "usuarios")) //revision de permiso para editar
			return res.sendStatus(403);
		await log(req.sesion.nombre, "editar registro", "/usuarios/" + req.params.id);
		await updateData("usuarios", Number(req.params.id), req, res);
	});

	//* tutores
	app.get("/tutores", verificarToken, async (req, res)=>{
		await log(req.sesion.nombre, "consultar datos", "/tutores");
		await getList("tutores", req, res);
	});

	app.get("/tutores/:id", verificarToken, async (req, res)=>{
		await log(req.sesion.nombre, "consultar registro", "/tutores/" + req.params.id);
		await getOne("tutores", Number(req.params.id), req, res);
	});

	app.post("/tutores", verificarToken, async (req, res)=>{
		if (!puedeEscribir(req.sesion, "tutores")) 
			return res.sendStatus(403);
		await log(req.sesion.nombre, "crear registro", "/tutores");
		await createData("tutores", req, res);
	});

	app.put("/tutores/:id", verificarToken, async (req, res)=>{
		if (!puedeEscribir(req.sesion, "tutores")) 
			return res.sendStatus(403);
		await log(req.sesion.nombre, "editar registro", "/tutores/" + req.params.id);
		await updateData("tutores", Number(req.params.id), req, res);
	});

	//* estancias
	app.get("/estancias", verificarToken, async (req, res)=>{
		await log(req.sesion.nombre, "consultar datos", "/estancias");
		await getList("estancias", req, res);
	});

	app.get("/estancias/:id", verificarToken, async (req, res)=>{
		await log(req.sesion.nombre, "consultar registro", "/estancias/" + req.params.id);
		await getOne("estancias", Number(req.params.id), req, res);
	});

	app.post("/estancias", verificarToken, async (req, res)=>{
		if (!puedeEscribir(req.sesion, "estancias")) 
			return res.sendStatus(403);
		await log(req.sesion.nombre, "crear registro", "/estancias");
		await createData("estancias", req, res);
	});

	app.put("/estancias/:id", verificarToken, async (req, res)=>{
		if (!puedeEscribir(req.sesion, "estancias")) 
			return res.sendStatus(403);
		await log(req.sesion.nombre, "editar registro", "/estancias/" + req.params.id);
		await updateData("estancias", Number(req.params.id), req, res);
	});

	//* infantes
	app.get("/infantes", verificarToken, async (req, res)=>{
		await log(req.sesion.nombre, "consultar datos", "/infantes");
		await getList("infantes", req, res);
	});

	app.get("/infantes/:id", verificarToken, async (req, res)=>{
		await log(req.sesion.nombre, "consultar registro", "/infantes/" + req.params.id);
		await getOne("infantes", Number(req.params.id), req, res);
	});

	app.post("/infantes", verificarToken, async (req, res)=>{
		if (!puedeEscribir(req.sesion, "infantes")) 
			return res.sendStatus(403);
		await log(req.sesion.nombre, "crear registro", "/infantes");
		await createData("infantes", req, res);
	});

	app.put("/infantes/:id", verificarToken, async (req, res)=>{
		if (!puedeEscribir(req.sesion, "infantes")) 
			return res.sendStatus(403);
		await log(req.sesion.nombre, "editar registro", "/infantes/" + req.params.id);
		await updateData("infantes", Number(req.params.id), req, res);
	});

	//* mediciones
	app.get("/mediciones", verificarToken, async (req, res)=>{
		await log(req.sesion.nombre, "consultar datos", "/mediciones");
		await getList("mediciones", req, res);
	});

	app.get("/mediciones/:id", verificarToken, async (req, res)=>{
		await log(req.sesion.nombre, "consultar registro", "/mediciones/" + req.params.id);
		await getOne("mediciones", Number(req.params.id), req, res);
	});

	app.post("/mediciones", verificarToken, async (req, res)=>{
		if (!puedeEscribir(req.sesion, "mediciones")) 
			return res.sendStatus(403);
		await log(req.sesion.nombre, "crear registro", "/mediciones");
		await createData("mediciones", req, res);
	});

	app.put("/mediciones/:id", verificarToken, async (req, res)=>{
		if (!puedeEscribir(req.sesion, "mediciones")) 
			return res.sendStatus(403);
		await log(req.sesion.nombre, "editar registro", "/mediciones/" + req.params.id);
		await updateData("mediciones", Number(req.params.id), req, res);
	});
}

module.exports = {registrarRutas};
