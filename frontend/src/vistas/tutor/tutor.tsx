import {
  List, DataTable, DateField, ShowButton,
} from "react-admin";

export const TutorList = () => (
  <List title="Mi hija o hijo" pagination={false} actions={false}>
    <DataTable rowClick="show" bulkActionButtons={false} aria-label="Mis hijas e hijos">
      <DataTable.Col source="nombre" label="Nombre" />
      <DataTable.Col source="paterno" label="Apellido paterno" />
      <DataTable.Col source="materno" label="Apellido materno" />
      <DataTable.Col source="fnac" label="Nacimiento">
        <DateField source="fnac" locales="es-MX" options={{ timeZone: "UTC" }} />
      </DataTable.Col>
      <DataTable.Col label="Acciones">
        <ShowButton label="Ver datos y medidas" />
      </DataTable.Col>
    </DataTable>
  </List>
);