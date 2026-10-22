import {
  List, DataTable, DateField, Show, SimpleShowLayout, TextField, ReferenceManyField,
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

export const TutorShow = () => (
  <Show title="Crecimiento de mi hija o hijo">
    <SimpleShowLayout>
      <TextField source="nombre" label="Nombre" />
      <TextField source="paterno" label="Apellido paterno" />
      <TextField source="materno" label="Apellido materno" />
      <TextField source="matricula" label="Matrícula" />
      <DateField source="fnac" label="Fecha de nacimiento" locales="es-MX" options={{ timeZone: "UTC" }} />
      <ReferenceManyField
        label="Historial de mediciones"
        reference="mediciones"
        target="infanteId"
        sort={{ field: "fecha", order: "DESC" }}
      >
        <DataTable bulkActionButtons={false}>
          <DataTable.Col source="fecha" label="Fecha">
            <DateField source="fecha" locales="es-MX" options={{ timeZone: "UTC" }} />
          </DataTable.Col>
          <DataTable.Col source="peso" label="Peso (kg)" />
          <DataTable.Col source="talla" label="Talla (cm)" />
          <DataTable.Col source="perimetroCefalico" label="Perímetro cefálico (cm)" />
        </DataTable>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);