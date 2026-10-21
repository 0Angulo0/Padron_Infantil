import jsonServerProvider from "ra-data-json-server";

/*
! descomentar al acabar de configurar el backend
export const dataProvider = jsonServerProvider(
  import.meta.env.VITE_JSON_SERVER_URL,
);
*/

export const dataProvider = jsonServerProvider(
  "https://jsonplaceholder.typicode.com",
);
