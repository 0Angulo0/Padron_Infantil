import { List, DataTable, DateField, CreateButton } from "react-admin";

export const InfanteList = () => (
  <List actions={<CreateButton label="Registrar infante" />}>
    <DataTable bulkActionButtons={false}>
      <DataTable.Col source="expediente" label="Matrícula" />
      <DataTable.Col source="nombre" label="Nombre" />
      <DataTable.Col source="apellidos" label="Apellidos" />
      <DataTable.Col source="fechaNacimiento" label="Nacimiento">
        <DateField source="fechaNacimiento" locales="es-MX" options={{ timeZone: "UTC" }} />
      </DataTable.Col>
    </DataTable>
  </List>
);