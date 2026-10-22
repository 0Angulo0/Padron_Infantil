import { Admin, Resource, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom"
import { Layout } from "./Layout";
import { dataProvider } from "./proveedores/dataProvider";
import { tema } from "./theme";
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
import { MoverEbdi } from "./vistas/estancia/moveredbi";

//^ traducción
import { authProvider } from "./proveedores/authProvider";
import { i18nProvider } from "./proveedores/i18nProvider";

//* pantallas de cada rol, si no está en su rol no aparece
//? las curvas son el show de cada infante, se abren dando clic en la fila
const captura = (
  <Resource name="mediciones" options={{ label: "Captura de medidas" }} create={MedicionCreate} />
);

//? mover de estancia o dar de baja: solo estancia y admin (el backend también lo revisa)
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
          edit={AdminInfanteEdit}
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
        {captura}
        {movimiento}
      </>
    );
  }
  return null; //manda a login
};

export const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    theme={tema}
    i18nProvider={i18nProvider}
    layout={Layout}
  >
  <CustomRoutes noLayout>
    <Route path="/primeracceso" element={<PrimerAcceso />} />
  </CustomRoutes>
    {(rol) => pantallasPorRol(rol)}
  </Admin>
);
