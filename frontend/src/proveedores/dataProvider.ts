import jsonServerProvider from "ra-data-json-server";

/*export const dataProvider = jsonServerProvider(
  import.meta.env.VITE_JSON_SERVER_URL,
);
*/

export const dataProvider = jsonServerProvider(
  "https://jsonplaceholder.typicode.com",
);
