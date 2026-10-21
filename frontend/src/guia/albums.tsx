//! RECONSTRUIDO: el original (57 líneas) se perdió; se rehízo con el mismo patrón que posts.tsx y todos.tsx.
import { List, DataTable,
    ReferenceField, EditButton,
    Show, SimpleShowLayout,
    TextField, Edit, Create,
    SimpleForm, TextInput,
    ReferenceInput,
} from "react-admin";

const albumFilters = [  //? deja escribir texto para filtrar por usuario
    <TextInput source="q" alwaysOn />,
    <ReferenceInput source="userId" reference="users" />,
];

export const AlbumList = () => (
    <List filters={albumFilters}>
        <DataTable rowClick="show">
            <DataTable.Col source="id" />
            <DataTable.Col source="userId">
                <ReferenceField source="userId" reference="users" link="show" />
            </DataTable.Col>
            <DataTable.Col source="title" />
            <DataTable.Col>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </List>
);

export const AlbumShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <ReferenceField source="userId" reference="users" link="show" />
            <TextField source="title" />
        </SimpleShowLayout>
    </Show>
);

export const AlbumEdit = () => (
    <Edit>
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput disabled source="id" />
            <ReferenceInput source="userId" reference="users" />
            <TextInput required source="title" />
        </SimpleForm>
    </Edit>
);

export const AlbumCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput source="userId" reference="users" />
            <TextInput required source="title" />
        </SimpleForm>
    </Create>
);
