import {
  List, DataTable, TopToolbar, FilterButton, ExportButton,
  TextInput, NumberInput, DateField, ShowButton
} from "react-admin";
import { RegionField } from "../estancia/lista";

//* estancias de su región (el backend ya filtra por la región del coordinador)
const filtros = [
  <TextInput label="Estado" source="estado" alwaysOn />,
];

const Acciones = () => (
  <TopToolbar>
    <FilterButton />
    <ExportButton label="Descargar reporte" />
  </TopToolbar>
);

export const ResumenList = () => (
  <List title="Estancias de mi región" filters={filtros} actions={<Acciones />}>
    <DataTable bulkActionButtons={false}>
      <DataTable.Col source="numero" label="EBDI" />
      <DataTable.Col source="nombre" label="Nombre" />
      <DataTable.Col source="estado" label="Estado" />
      <DataTable.Col source="tipo" label="Tipo" />
      <DataTable.Col source="region" label="Región" />
    </DataTable>
  </List>
);


//* infantes de su región, solo lectura (el coordinador no puede escribir)
const infanteFiltros = [
  <NumberInput label="Matrícula" source="matricula" alwaysOn />,
  <NumberInput label="EBDI" source="ebdi" />,
];

export const CoordinadorInfanteList = () => (
<List title="Infantes de mi región" filter={{ activo: 1 }} filters={infanteFiltros}>
      <DataTable rowClick="show" bulkActionButtons={false}>
      <DataTable.Col source="matricula" label="Matrícula" />
      <DataTable.Col source="ebdi" label="EBDI" />
      <DataTable.Col label="Región">
        <RegionField />
      </DataTable.Col>
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
