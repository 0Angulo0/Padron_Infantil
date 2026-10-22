import type { ReactNode } from "react";
import {
  Layout as RALayout,
  CheckForApplicationUpdate,
  Menu,
  usePermissions,
} from "react-admin";
import CapturaIcon from "@mui/icons-material/EditNote";

//* menú lateral según el rol
const MenuPorRol = () => {
  const { permissions } = usePermissions();  //jala los permisos que se ocupan
  return (
    <Menu>
      <Menu.DashboardItem />
      <Menu.ResourceItems />
    </Menu>
  );
};

export const Layout = ({ children }: { children: ReactNode }) => (
  <RALayout menu = {MenuPorRol}>
    {children}
    <CheckForApplicationUpdate />
  </RALayout>
);
