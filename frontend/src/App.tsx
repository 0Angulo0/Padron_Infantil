/*
! los códigos de vistas, app.tsx, index.tsx, layout.tsx y theme.tsx tomaron como base los códigos de
! los tutoriales de react-admin (https://marmelab.com/react-admin/Tutorial.html)
*/
import { Admin, Resource, CustomRoutes, Login, LoginForm } from "react-admin"; 
import { Route } from "react-router-dom";
import { Alert } from "@mui/material";
import { Layout } from "./Layout";
import { dataProvider } from "./proveedores/dataProvider";
import { tema } from "./theme";
import logo from "./recursos/Logo_gobierno2026.jpeg"; 
import InfanteIcon from "@mui/icons-material/ChildCare";
import TutorIcon from "@mui/icons-material/FamilyRestroom";
import CoordinadorIcon from "@mui/icons-material/Assessment";
import PersonalIcon from "@mui/icons-material/Badge";
import EstanciaIcon from "@mui/icons-material/HomeWork";

//^ vistas de Padrón Infantil
import { InfanteList } from "./vistas/estancia/lista";
import { InfanteCreate } from "./vistas/estancia/registro";
import { MedicionCreate } from "./vistas/estancia/captura";
import { InfanteCurvas } from "./vistas/estancia/curvas";
import { TutorList } from "./vistas/tutor/tutor";
import { ResumenList, CoordinadorInfanteList } from "./vistas/coordinador/coordinador";
import { AdminInfanteList, AdminInfanteEdit } from "./vistas/admin/admin";
import { PersonalList, PersonalCreate, PersonalEdit, EstanciaList, EstanciaCreate, EstanciaEdit } from "./vistas/admin/registroPersonal";
import { PrimerAcceso } from "./vistas/tutor/primeracceso";
import { MoverEbdi } from "./vistas/estancia/moveredbi";

//^ traducción
import { authProvider } from "./proveedores/authProvider";
import { i18nProvider } from "./proveedores/i18nProvider";

//* pantallas de cada rol, si no está en su rol no aparece
const captura = (
  <Resource name="mediciones" options={{ label: "Captura de medidas" }} create={MedicionCreate} />
);

const movimiento = (
  <CustomRoutes>
    <Route path="/infantes/:id/movimiento" element={<MoverEbdi />} />
  </CustomRoutes>
);

const pantallasPorRol = (rol: string) => {
  if (rol == "tutor") {
    return (
      <Resource
        name="infantes"
        options={{ label: "Mi hija o hijo" }}
        list={TutorList}
        show={InfanteCurvas} // la familia ve las mismas curvas que la estancia
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
        {movimiento}
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
        <Resource
          name="usuarios"
          options={{ label: "Personal" }}
          list={PersonalList}
          create={PersonalCreate}
          edit={PersonalEdit}
          icon={PersonalIcon}
        />
        <Resource
          name="estancias"
          options={{ label: "Estancias" }}
          list={EstanciaList}
          create={EstanciaCreate}
          edit={EstanciaEdit}
          icon={EstanciaIcon}
        />
        {movimiento}
      </>
    );
  }
  return null; //manda a login
};

const LoginConLogo = () => (
  <Login
    sx={{
      "& .RaLogin-avatar": { display: "none" },
      "& .RaLoginForm-content": { mx: "auto" }, // centra los campos y el botón 
    }}
  >
        <img src={logo} alt="Gobierno de México" style={{ display: "block", width: 260, margin: "16px auto 0" }}/>
    <LoginForm />
    <Alert severity="info" sx={{ m: 2, mt: 0, maxWidth: 400 }}> 
      ¿Eres madre, padre o tutor y es tu primera vez? Escribe tu clave de acceso (ID-…) en Usuario y también en
      Contraseña.
    </Alert>
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
      <Route path="/primeracceso" element={<PrimerAcceso />} />
    </CustomRoutes>
    {(rol) => pantallasPorRol(rol)}
  </Admin>
);