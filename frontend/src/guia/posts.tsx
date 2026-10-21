import { List, DataTable,
    ReferenceField, EditButton,
    TextInput, TextField,
    Edit, SimpleForm,
    ReferenceInput, Create,
    Show, SimpleShowLayout
}
from "react-admin";

const postFilters = [  //? deja escribir texto para filtrar por userid
    <TextInput source="q" alwaysOn />,
    <ReferenceInput source="userId" reference="users" />,
];

export const PostList = () => (
    <List filters={postFilters}>
        <DataTable rowClick="show" >
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

export const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <ReferenceField source="userId" reference="users" link="show" />
            <TextField source="title" />
            <TextField source="body" />
        </SimpleShowLayout>
    </Show>
);

export const PostEdit = () => (
    <Edit>
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput disabled source="id" />
            <ReferenceInput source="userId" reference="users" />
            <TextInput required source="title" />
            <TextInput source="body" />
        </SimpleForm>
    </Edit>
);

export const PostCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="userId" reference="users" />
      <TextInput source="title" />
      <TextInput source="body" multiline rows={5} />
    </SimpleForm>
  </Create>
);

