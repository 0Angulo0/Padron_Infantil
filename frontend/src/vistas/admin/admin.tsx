import {
  List, DataTable, DateField, EditButton, CreateButton, TopToolbar,
  Edit, SimpleForm, Toolbar, SaveButton,
  TextInput, NumberInput, DateInput, SelectInput, required, maxLength,
} from "react-admin";

//* el admin ve y edita todo el padrón (tabla padron del sql)
const filtros = [
  <NumberInput label="Matrícula" source="matricula" alwaysOn />,
  <NumberInput label="EBDI" source="ebdi" />,
  <TextInput label="UR" source="ur" />,
];

export const AdminInfanteList = () => (
  <List
    title="Padrón de infantes"
    filters={filtros}
    actions={<TopToolbar><CreateButton label="Registrar infante" /></TopToolbar>}
  >
    <DataTable rowClick="show" bulkActionButtons={false}>
      <DataTable.Col source="matricula" label="Matrícula" />
      <DataTable.Col source="ebdi" label="EBDI" />
      <DataTable.Col source="ur" label="UR" />
      <DataTable.Col source="nombre" label="Nombre" />
      <DataTable.Col source="paterno" label="Apellido paterno" />
      <DataTable.Col source="materno" label="Apellido materno" />
      <DataTable.Col source="fnac" label="Nacimiento">
        <DateField source="fnac" locales="es-MX" options={{ timeZone: "UTC" }} />
      </DataTable.Col>
      <DataTable.Col>
        <EditButton />
      </DataTable.Col>
    </DataTable>
  </List>
);

//? el backend no tiene ruta para borrar, por eso solo se deja guardar
export const AdminInfanteEdit = () => (
  <Edit title="Editar infante">
    <SimpleForm warnWhenUnsavedChanges toolbar={<Toolbar><SaveButton /></Toolbar>}>
      <NumberInput source="matricula" label="Matrícula" validate={required()} />
      <TextInput source="ur" label="UR" validate={maxLength(3)} />
      <NumberInput source="ebdi" label="EBDI" validate={required()} />
      <TextInput source="nombre" label="Nombre(s)" validate={required()} />
      <TextInput source="paterno" label="Apellido paterno" validate={required()} />
      <TextInput source="materno" label="Apellido materno" />
      <SelectInput
        source="genero"
        label="Sexo"
        choices={[{ id: "M", name: "Mujer" }, { id: "H", name: "Hombre" }]} // como en la CURP y en la tabla padron del socio
        validate={required()}
      />
      <TextInput source="curp" label="CURP" validate={maxLength(18)} />
      <DateInput source="fnac" label="Fecha de nacimiento" validate={required()} />
      {/* activo y estatus_servicio los calcula el backend al dar de baja */}
      <SelectInput source="baja" label="Baja" choices={[{ id: 0, name: "No" }, { id: 1, name: "Sí" }]} />
      <SelectInput
        source="motivoBaja"
        label="Motivo de baja"
        choices={[
          { id: 1, name: "Egreso por edad" },
          { id: 2, name: "Cambio de domicilio o de trabajo" },
          { id: 3, name: "Decisión de la familia" },
          { id: 4, name: "Otro" },
        ]}
      />
      <DateInput source="fBaja" label="Fecha de baja" />
    </SimpleForm>
  </Edit>
);
