import {
  List, DataTable, DateField, EditButton,
  Edit, SimpleForm, Toolbar, SaveButton,
  TextInput, NumberInput, DateInput, SelectInput, required, maxLength, minValue, maxValue,
} from "react-admin";
import { RegionField, regiones } from "../estancia/lista";

//* el admin ve y edita todo el padrón (tabla padron del sql)
const filtros = [
  <NumberInput label="Matrícula" source="matricula" alwaysOn />,
  <NumberInput label="EBDI" source="ebdi" />,
  <SelectInput label="Región" source="region" choices={regiones} />,
  <SelectInput
    label="Región"
    source="region"
    choices={[
      { id: "Centro", name: "Centro" },
      { id: "Norte", name: "Norte" },
      { id: "Oeste", name: "Oeste" },
      { id: "Este", name: "Este" },
      { id: "Sur", name: "Sur" },
    ]}
    alwaysOn
  />,
];

export const AdminInfanteList = () => (
  <List
    title="Padrón de infantes"
    filters={filtros}
  >
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
      {/* al guardar, el backend vuelve a calcular la talla blanco familiar con estas dos y el sexo */}
      <NumberInput
        source="tallaMama"
        label="Talla de la mamá (cm)"
        step={0.1}
        helperText="Vacía si no se conoce (se usa 162 cm, la media en México)."
        validate={[minValue(110, "Mínimo 110 cm"), maxValue(220, "Máximo 220 cm")]}
      />
      <NumberInput
        source="tallaPapa"
        label="Talla del papá (cm)"
        step={0.1}
        helperText="Vacía si no se conoce (se usa 170 cm, la media en México)."
        validate={[minValue(110, "Mínimo 110 cm"), maxValue(220, "Máximo 220 cm")]}
      />
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
