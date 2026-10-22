import type { ReactNode } from "react";
import {
  Layout as RALayout,
  CheckForApplicationUpdate,
  Menu,
} from "react-admin";

//* menú lateral según el rol
const MenuPorRol = () => {
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
