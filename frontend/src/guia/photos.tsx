//! RECONSTRUIDO: el original (67 líneas) se perdió; se rehízo con el mismo patrón que posts.tsx y todos.tsx.
import { List, DataTable,
    ReferenceField, EditButton,
    Show, SimpleShowLayout,
    TextField, ImageField, UrlField,
    Edit, Create,
    SimpleForm, TextInput,
    ReferenceInput,
} from "react-admin";

const photoFilters = [  //? deja escribir texto para filtrar por álbum
    <TextInput source="q" alwaysOn />,
    <ReferenceInput source="albumId" reference="albums" />,
];

export const PhotoList = () => (
    <List filters={photoFilters}>
        <DataTable rowClick="show">
            <DataTable.Col source="id" />
            <DataTable.Col source="albumId">
                <ReferenceField source="albumId" reference="albums" link="show" />
            </DataTable.Col>
            <DataTable.Col source="title" />
            <DataTable.Col source="thumbnailUrl">
                <ImageField source="thumbnailUrl" />
            </DataTable.Col>
            <DataTable.Col>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </List>
);

export const PhotoShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <ReferenceField source="albumId" reference="albums" link="show" />
            <TextField source="title" />
            <UrlField source="url" />
            <ImageField source="thumbnailUrl" />
        </SimpleShowLayout>
    </Show>
);

export const PhotoEdit = () => (
    <Edit>
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput disabled source="id" />
            <ReferenceInput source="albumId" reference="albums" />
            <TextInput required source="title" />
            <TextInput source="url" />
            <TextInput source="thumbnailUrl" />
        </SimpleForm>
    </Edit>
);

export const PhotoCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput source="albumId" reference="albums" />
            <TextInput required source="title" />
            <TextInput source="url" />
            <TextInput source="thumbnailUrl" />
        </SimpleForm>
    </Create>
);
