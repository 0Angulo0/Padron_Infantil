import type { ReactNode } from "react";
import {
  Layout as RALayout,
  AppBar,
  TitlePortal,
  CheckForApplicationUpdate,
  Menu,
  usePermissions,
} from "react-admin";
import AddchartIcon from "@mui/icons-material/Addchart";
import logo from "./recursos/Logo_gobierno2026.jpeg";

//* nombre del rol como se muestra al usuario
const NOMBRE_ROL: Record<string, string> = {
  admin: "Administrador",
  coordinador: "Coordinador regional",
  estancia: "Personal de estancia",
  tutor: "Madre, padre o tutor",
};

//* menú lateral según el rol
const MenuPorRol = () => {
  const { permissions } = usePermissions();
  return (
    <Menu>
      <Menu.ResourceItems />
      {(permissions == "estancia") && (
        <Menu.Item to="/mediciones/create" primaryText="Captura de medidas" leftIcon={<AddchartIcon />} />
      )}
    </Menu>
  );
};

//* barra superior: logo, título de la pantalla y rol de quien inició sesión
const Barra = () => {
  const { permissions } = usePermissions();
  return (
    <AppBar>
      <img src={logo} alt="Gobierno de México" style={{ height: 40, marginRight: 16 }} />
      <TitlePortal component="h1" />
      <span style={{ marginRight: 8, fontWeight: 600 }}>{NOMBRE_ROL[permissions] ?? ""}</span>
    </AppBar>
  );
};

export const Layout = ({ children }: { children: ReactNode }) => (
  //? minWidth 0: sin esto los contenedores crecen al ancho de la tabla y se desliza toda la página;
  //? así solo se desliza la tabla dentro de su tarjeta
  <RALayout
    menu={MenuPorRol}
    appBar={Barra}
    sx={{
      minWidth: 0,
      "& .RaLayout-appFrame, & .RaLayout-contentWithSidebar, & .RaLayout-content, & .RaList-main": { minWidth: 0 },
      "& .MuiCard-root.RaList-content": { overflowX: "auto" }, // la tarjeta de la tabla (dos clases para ganarle al estilo de react-admin)
      "& .RaShow-main, & .RaCreate-main, & .RaEdit-main": { minWidth: 0 }, // curvas y formularios tampoco se salen de la pantalla
      "& .MuiCardContent-root": { overflowX: "auto" }, 
    }}
  >
    {children}
    <CheckForApplicationUpdate />
  </RALayout>
);