import {
  List, DataTable, DateField,
} from "react-admin";

export const TutorList = () => (
  <List title="Mi hija o hijo" pagination={false} actions={false}>
    <DataTable rowClick="show" bulkActionButtons={false}>
      <DataTable.Col source="nombre" label="Nombre" />
      <DataTable.Col source="paterno" label="Apellido paterno" />
      <DataTable.Col source="materno" label="Apellido materno" />
      <DataTable.Col source="fnac" label="Nacimiento">
        <DateField source="fnac" locales="es-MX" options={{ timeZone: "UTC" }} />
      </DataTable.Col>
    </DataTable>
  </List>
);