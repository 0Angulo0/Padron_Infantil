//! RECONSTRUIDO: el original (65 líneas) se perdió; se rehízo con el mismo patrón que posts.tsx y todos.tsx.
import { List, DataTable,
    ReferenceField, EmailField,
    EditButton, Show,
    SimpleShowLayout, TextField,
    Edit, Create,
    SimpleForm, TextInput,
    ReferenceInput,
} from "react-admin";

const commentFilters = [  //? deja escribir texto para filtrar por publicación
    <TextInput source="q" alwaysOn />,
    <ReferenceInput source="postId" reference="posts" />,
];

export const CommentList = () => (
    <List filters={commentFilters}>
        <DataTable rowClick="show">
            <DataTable.Col source="id" />
            <DataTable.Col source="postId">
                <ReferenceField source="postId" reference="posts" link="show" />
            </DataTable.Col>
            <DataTable.Col source="name" />
            <DataTable.Col source="email">
                <EmailField source="email" />
            </DataTable.Col>
            <DataTable.Col>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </List>
);

export const CommentShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <ReferenceField source="postId" reference="posts" link="show" />
            <TextField source="name" />
            <EmailField source="email" />
            <TextField source="body" />
        </SimpleShowLayout>
    </Show>
);

export const CommentEdit = () => (
    <Edit>
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput disabled source="id" />
            <ReferenceInput source="postId" reference="posts" />
            <TextInput required source="name" />
            <TextInput source="email" />
            <TextInput source="body" multiline rows={5} />
        </SimpleForm>
    </Edit>
);

export const CommentCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput source="postId" reference="posts" />
            <TextInput required source="name" />
            <TextInput source="email" />
            <TextInput source="body" multiline rows={5} />
        </SimpleForm>
    </Create>
);
