import type { ReactNode } from "react";
import {
  Layout as RALayout,
  CheckForApplicationUpdate,
  Menu,
  usePermissions,
} from "react-admin";
import AddchartIcon from "@mui/icons-material/Addchart";

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

export const Layout = ({ children }: { children: ReactNode }) => (
  <RALayout menu = {MenuPorRol}>
    {children}
    <CheckForApplicationUpdate />
  </RALayout>
);