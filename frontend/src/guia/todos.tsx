import { List, DataTable,
    ReferenceField, BooleanField,
    EditButton, Show,
    SimpleShowLayout, TextField,
    Edit, Create,
    SimpleForm, TextInput, SelectInput,
    BooleanInput, ReferenceInput,
} from "react-admin";

const todoFilters = [
    <TextInput source="q" alwaysOn />,
    <ReferenceInput source="userId" reference="users" />, //? deja escribir texto para filtrar por usuario
    <SelectInput source="completed" label='Estado' //? deja filtrar por completado y no completado
        choices={[
            { id: true, name: 'Completadas' },
            { id: false, name: 'Pendientes' },
        ]}
    />,
];


export const TodoList = () => (
    <List filters={todoFilters}>
        <DataTable rowClick="show">
            <DataTable.Col source="id" />
            <DataTable.Col source="userId">
                <ReferenceField source="userId" reference="users" link="show" />
            </DataTable.Col>
            <DataTable.Col source="title" />
            <DataTable.Col source="completed">
                <BooleanField source="completed" />
            </DataTable.Col>
            <DataTable.Col>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </List>
);

export const TodoShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <ReferenceField source="userId" reference="users" link="show" />
            <TextField source="title" />
            <BooleanField source="completed" />
        </SimpleShowLayout>
    </Show>
);

export const TodoEdit = () => (
    <Edit>
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput disabled source="id" />
            <ReferenceInput source="userId" reference="users" />
            <TextInput required source="title" />
            <BooleanInput source="completed" />
        </SimpleForm>
    </Edit>
);

export const TodoCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput source="userId" reference="users" />
            <TextInput required source="title" />
            <BooleanInput source="completed" />
        </SimpleForm>
    </Create>
);
