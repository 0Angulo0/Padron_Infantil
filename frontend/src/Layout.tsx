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
      <TitlePortal />
      <span style={{ marginRight: 8, fontWeight: 600 }}>{NOMBRE_ROL[permissions] ?? ""}</span>
    </AppBar>
  );
};

export const Layout = ({ children }: { children: ReactNode }) => (
  <RALayout menu={MenuPorRol} appBar={Barra}>
    {children}
    <CheckForApplicationUpdate />
  </RALayout>
);