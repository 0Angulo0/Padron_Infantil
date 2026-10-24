//! para este código tome como base el codigo hecho por Jorge Rodriguez Ruiz (https://github.com/JorgeR-TEC/TC2007B-421-202624)

import { AuthProvider } from "react-admin";

export const authProvider : AuthProvider={
  login: async({username,password}) => {
    const request = new Request(import.meta.env.VITE_JSON_SERVER_URL + "/login", { //se crea el request con el port del bakend y la ruta
      method: "POST",
      body: JSON.stringify({"username": username, "password": password}), // se manda el user y pwd que dio el usuario
      headers: new Headers({"Content-type":"application/json"})
    });
    let res;  //la pase para aca porque catch decia que no existia
    try{
      res = await fetch(request);
    }catch{
      // el fetch solo falla así si no hay conexión con el backend
      throw new Error("No se pudo conectar con el servidor");
    }
    if (res.status == 403){ // pasa cuando la familia todavía no crea su contraseña
      sessionStorage.setItem("clavePrimerAcceso", username); // para que la clave ya salga escrita
      return { redirectTo: "/primeracceso" };
    }
    if (res.status < 200 || res.status >= 300){ // si esta por debajo de 200 o de 300 hacia arriba, esos son los estados de error
      throw new Error("Error en usuario o contraseña");  //no se encontro el usuario o la contraseña está mal
    }
    const auth = await res.json();
    sessionStorage.setItem("auth", auth.token);  //se asigna el token a la sesion
    sessionStorage.setItem("identity", JSON.stringify({"id":auth.id, "rol":auth.rol })) // se pone el id y rol de la sesion para los permisos
    return Promise.resolve();
  },

  logout:() => {
    sessionStorage.removeItem("auth")  //quita el token, id y rol
    sessionStorage.removeItem("identity");
    return Promise.resolve();
  },

  checkAuth:() => {
    return sessionStorage.getItem("auth") ? Promise.resolve() : Promise.reject()  // paso o no la autenticacion?
  },

  getPermissions:() => {
    const identity = sessionStorage.getItem("identity");
    // sin sesión se responde "sin rol" (null) y no un error
    return Promise.resolve(identity ? JSON.parse(identity).rol : null);
  },

  checkError:(error) => {
    const status = error.status;
    if(status == 401){ // si es unauthorized
      sessionStorage.removeItem("auth") //se borra el token, id y rol
      sessionStorage.removeItem("identity");
      return Promise.reject();  //se marca como fallido
    }
    return Promise.resolve();
  }
}
