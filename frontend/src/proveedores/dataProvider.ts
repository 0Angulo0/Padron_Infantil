/*
! para este código tome como base el codigo hecho por Jorge Rodriguez Ruiz (https://github.com/JorgeR-TEC/TC2007B-421-202624)
*/

import { fetchUtils } from "react-admin";  // herramienta de react para hacer peticiones al server
import jsonServerProvider from "ra-data-json-server";  // hace las peticiones

//* agrega el token de la sesión a cada petición
const fetchJsonUtils = (url: string, options: fetchUtils.Options = {}) => {
  const headers = new Headers( //agrega una etiqueta, la que traiga y sino se asigna una
    options.headers ?? { Accept: "application/json" },
  );
  const token = sessionStorage.getItem("auth"); // lo guarda el authProvider al iniciar sesión
  if (token) {
    headers.set("Authentication", token);
  }
  return fetchUtils.fetchJson(url, { ...options, headers });  //manda la peticion 
};

//* la URL del backend sale del .env 
export const dataProvider = jsonServerProvider(import.meta.env.VITE_JSON_SERVER_URL, fetchJsonUtils);
