import { Admin, Resource, CustomRoutes, Login, LoginForm } from "react-admin"; // ← NUEVO: Login, LoginForm
import { Route } from "react-router-dom";
import { Layout } from "./Layout";
import { dataProvider } from "./proveedores/dataProvider";
import { tema } from "./theme";
import logo from "./recursos/Logo_gobierno2026.jpeg"; // ← NUEVO
import InfanteIcon from "@mui/icons-material/ChildCare";
import TutorIcon from "@mui/icons-material/FamilyRestroom";
import CoordinadorIcon from "@mui/icons-material/Assessment";

//^ vistas de Padrón Infantil
import { InfanteList } from "./vistas/estancia/lista";
import { InfanteCreate } from "./vistas/estancia/registro";
import { MedicionCreate } from "./vistas/estancia/captura";
import { InfanteCurvas } from "./vistas/estancia/curvas";
import { TutorList, TutorShow } from "./vistas/tutor/tutor";
import { ResumenList, CoordinadorInfanteList } from "./vistas/coordinador/coordinador";
import { AdminInfanteList, AdminInfanteEdit } from "./vistas/admin/admin";
import { PrimerAcceso } from "./vistas/tutor/primeracceso";

//^ traducción
import { authProvider } from "./proveedores/authProvider";
import { i18nProvider } from "./proveedores/i18nProvider";

//* pantallas de cada rol, si no está en su rol no aparece
//? las curvas son el show de cada infante, se abren dando clic en la fila
const captura = (
  <Resource name="mediciones" options={{ label: "Captura de medidas" }} create={MedicionCreate} />
);

const pantallasPorRol = (rol: string) => {
  if (rol == "tutor") {
    return (
      <Resource
        name="infantes"
        options={{ label: "Mi hija o hijo" }}
        list={TutorList}
        show={TutorShow}
        icon={TutorIcon}
      />
    );
  }
  if (rol == "estancia") {
    return (
      <>
        <Resource
          name="infantes"
          options={{ label: "Infantes" }}
          list={InfanteList}
          create={InfanteCreate}
          show={InfanteCurvas}
          icon={InfanteIcon}
        />
        {captura}
      </>
    );
  }
  if (rol == "coordinador") {
    return (
      <>
        <Resource
          name="estancias"
          options={{ label: "Estancias de mi región" }}
          list={ResumenList}
          icon={CoordinadorIcon}
        />
        <Resource
          name="infantes"
          options={{ label: "Infantes de mi región" }}
          list={CoordinadorInfanteList}
          show={InfanteCurvas}
          icon={InfanteIcon}
        />
      </>
    );
  }
  if (rol == "admin") {
    return (
      <>
        <Resource
          name="infantes"
          options={{ label: "Padrón de infantes" }}
          list={AdminInfanteList}
          edit={AdminInfanteEdit}
          show={InfanteCurvas}
          icon={InfanteIcon}
        />
      </>
    );
  }
  return null; //manda a login
};

const LoginConLogo = () => (
  <Login sx={{ "& .RaLogin-avatar": { display: "none" } }}>
        <img src={logo} alt="Gobierno de México" style={{ display: "block", width: 260, margin: "16px auto 0" }}/>
    <LoginForm />
  </Login>
);

export const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    theme={tema}
    i18nProvider={i18nProvider}
    layout={Layout}
    loginPage={LoginConLogo} 
  >
    <CustomRoutes noLayout>
      <Route path="/primer-acceso" element={<PrimerAcceso />} />
    </CustomRoutes>
    {(rol) => pantallasPorRol(rol)}
  </Admin>
);