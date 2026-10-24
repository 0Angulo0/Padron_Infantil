import {
  List, DataTable, Create, Edit, SimpleForm, Toolbar, SaveButton, CreateButton,
  TextInput, NumberInput, SelectInput, BooleanInput, PasswordInput, ReferenceInput, FormDataConsumer,
  SelectField, BooleanField, ReferenceField, TextField, required, email,
} from "react-admin";
import { regiones } from "../estancia/lista";

//* el admin da de alta al personal y las estancias
export const PersonalList = () => (
  <List title="Personal" actions={<CreateButton label="Agregar persona" />}>
    <DataTable rowClick="edit" bulkActionButtons={false}>
      <DataTable.Col source="nombre" label="Nombre" />
      <DataTable.Col source="email" label="Correo" />
      <DataTable.Col source="rol" label="Rol">
        <SelectField
          source="rol"
          choices={[
            { id: "admin", name: "Administrador" },
            { id: "coordinador", name: "Coordinador regional" },
            { id: "estancia", name: "Personal de estancia" },
          ]}
        />
      </DataTable.Col>
      <DataTable.Col source="estanciaId" label="Estancia">
        <ReferenceField source="estanciaId" reference="estancias" link={false} emptyText="—">
          <TextField source="nombre" />
        </ReferenceField>
      </DataTable.Col>
      <DataTable.Col source="region" label="Región" />
      <DataTable.Col source="activo" label="Activa">
        <BooleanField source="activo" />
      </DataTable.Col>
    </DataTable>
  </List>
);

export const PersonalCreate = () => (
  <Create title="Agregar persona" redirect="list">
    <SimpleForm>
      <TextInput source="nombre" label="Nombre completo" validate={required()} />
      <TextInput source="email" label="Correo" validate={[required(), email("Escribe un correo válido")]} />
      <SelectInput
        source="rol"
        label="Rol"
        choices={[
          { id: "admin", name: "Administrador" },
          { id: "coordinador", name: "Coordinador regional" },
          { id: "estancia", name: "Personal de estancia" },
        ]}
        validate={required()}
      />
      <FormDataConsumer>
        {({ formData }) => formData.rol == "estancia" && (
          <ReferenceInput source="estanciaId" reference="estancias" perPage={100}>
            <SelectInput label="Estancia" optionText="nombre" validate={required()} />
          </ReferenceInput>
        )}
      </FormDataConsumer>
      <FormDataConsumer>
        {({ formData }) => formData.rol == "coordinador" && (
          <SelectInput source="region" label="Región" choices={regiones} validate={required()} />
        )}
      </FormDataConsumer>
      <PasswordInput
        source="password"
        label="Contraseña inicial"
        helperText="Mínimo 8 caracteres, con mayúscula, minúscula, número y carácter especial."
        validate={required()}
      />
    </SimpleForm>
  </Create>
);

export const PersonalEdit = () => (
  <Edit title="Editar persona" mutationMode="pessimistic">
    <SimpleForm toolbar={<Toolbar><SaveButton /></Toolbar>}>
      <TextInput source="nombre" label="Nombre completo" validate={required()} />
      <TextInput source="email" label="Correo" validate={[required(), email("Escribe un correo válido")]} />
      <SelectInput
        source="rol"
        label="Rol"
        choices={[
          { id: "admin", name: "Administrador" },
          { id: "coordinador", name: "Coordinador regional" },
          { id: "estancia", name: "Personal de estancia" },
        ]}
        validate={required()}
      />
      <FormDataConsumer>
        {({ formData }) => formData.rol == "estancia" && (
          <ReferenceInput source="estanciaId" reference="estancias" perPage={100}>
            <SelectInput label="Estancia" optionText="nombre" validate={required()} />
          </ReferenceInput>
        )}
      </FormDataConsumer>
      <FormDataConsumer>
        {({ formData }) => formData.rol == "coordinador" && (
          <SelectInput source="region" label="Región" choices={regiones} validate={required()} />
        )}
      </FormDataConsumer>
      <BooleanInput source="activo" label="Cuenta activa (puede iniciar sesión)" />
    </SimpleForm>
  </Edit>
);
// el booleanInput de arriba es para cuando un trabajador deje el issste, no se borra su info, pero se le quita el acceso

export const EstanciaList = () => (
  <List title="Estancias" actions={<CreateButton label="Agregar estancia" />}>
    <DataTable rowClick="edit" bulkActionButtons={false}>
      <DataTable.Col source="numero" label="EBDI" />
      <DataTable.Col source="nombre" label="Nombre" />
      <DataTable.Col source="tipo" label="Tipo" />
      <DataTable.Col source="estado" label="Estado" />
      <DataTable.Col source="region" label="Región" />
    </DataTable>
  </List>
);

export const EstanciaCreate = () => (
  <Create title="Agregar estancia" redirect="list">
    <SimpleForm>
      <NumberInput source="numero" label="Número de EBDI" validate={required()} />
      <TextInput source="nombre" label="Nombre" validate={required()} />
      <SelectInput
        source="tipo"
        label="Tipo"
        choices={[{ id: "Propia", name: "Propia" }, { id: "Contratadas", name: "Contratadas" }, { id: "OSC", name: "OSC" }]} // como vienen en la base
        validate={required()}
      />
      <TextInput source="estado" label="Estado" validate={required()} />
      <SelectInput source="region" label="Región" choices={regiones} validate={required()} />
    </SimpleForm>
  </Create>
);

export const EstanciaEdit = () => (
  <Edit title="Editar estancia" mutationMode="pessimistic">
    <SimpleForm toolbar={<Toolbar><SaveButton /></Toolbar>}>
      <NumberInput source="numero" label="Número de EBDI" disabled />
      <TextInput source="nombre" label="Nombre" validate={required()} />
      <SelectInput
        source="tipo"
        label="Tipo"
        choices={[{ id: "Propia", name: "Propia" }, { id: "Contratadas", name: "Contratadas" }, { id: "OSC", name: "OSC" }]}
        validate={required()}
      />
      <TextInput source="estado" label="Estado" validate={required()} />
      <SelectInput source="region" label="Región" choices={regiones} validate={required()} />
    </SimpleForm>
  </Edit>
);
