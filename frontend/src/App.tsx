import { Admin, Resource } from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./proveedores/dataProvider";
import { tema } from "./theme";
import { Dashboard } from "./guia/dashboard"; //dashboard

//^ vistas de Padrón Infantil
import { Curvas } from "./vistas/curvas";
import CurvasIcon from "@mui/icons-material/ShowChart";
import { Tutor } from "./vistas/tutor";
import TutorIcon from "@mui/icons-material/FamilyRestroom";
import { Coordinador } from "./vistas/coordinador";
import CoordinadorIcon from "@mui/icons-material/Assessment";
import { Panel } from "./vistas/admin";
import AdminIcon from "@mui/icons-material/AdminPanelSettings";
import { MedicionCreate } from "./vistas/captura";

//^ traducción
import { authProvider } from "./proveedores/authProvider";
import { i18nProvider } from "./proveedores/i18nProvider";

//* pantallas de cada rol, si no está en en su rol no aparece
const curvas = (
  <Resource
    name = "curvas"
    options = {{ label: "Curvas de crecimiento" }}
    list = {Curvas}
    icon = {CurvasIcon}
  />
);
const captura = (
  <Resource
    name = "mediciones"
    options = {{ label: "Captura de medidas" }}
    create = {MedicionCreate}
  />
);

const pantallasPorRol = (rol: string) => {
  if (rol == "tutor") {
    return (
      <Resource
        name = "tutor"
        options = {{ label: "Vista del tutor" }}
        list = {Tutor}
        icon = {TutorIcon}
      />
    );
  }
  if (rol == "estancia") {
    return (
      <>
        {captura}
        {curvas}
      </>
    );
  }
  if (rol == "coordinador") {
    return (
      <>
        <Resource
          name = "coordinador"
          options = {{ label: "Vista del coordinador" }}
          list = {Coordinador}
          icon = {CoordinadorIcon}
        />
      </>
    );
  }
  if (rol == "admin") {
    return (
      <>
        <Resource
          name = "admin"
          options = {{ label: "Panel del administrador" }}
          list = {Panel}
          icon = {AdminIcon}
        />
      </>
    );
  }
  return null; //manda a login
};


export const App = () => (
  <Admin
    dataProvider = {dataProvider}
    authProvider = {authProvider}
    theme = {tema}
    dashboard = {Dashboard}
    i18nProvider = {i18nProvider}
    layout = {Layout}
  >
    {(rol) => pantallasPorRol(rol)} 
  </Admin>
);
