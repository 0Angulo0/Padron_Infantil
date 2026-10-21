import { List, DataTable,
  EmailField, SimpleList,
  Show, SimpleShowLayout,
  TextField, Edit,
  Create, SimpleForm,
  TextInput, required,
  EditButton
} from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";


/*
export const UserList = () => (
  <List>
    <DataTable>
        <DataTable.Col source="id" />
        <DataTable.Col source="name" />
        <DataTable.Col source="username" />
        <DataTable.Col source="email" >
            <EmailField source="email" />
        </ DataTable.Col>
        <DataTable.Col source="address.street" />
        <DataTable.Col source="phone" />
        <DataTable.Col source="website" />
        <DataTable.Col source="company.name" />
    </DataTable>
    </List>
);


export const UserList = () => (
  <List>
    <SimpleList
      primaryText={(record) => record.name}
      secondaryText={(record) => record.username}
      tertiaryText={(record) => record.email}
    />
  </List>
);*/

const usersFilters = [  //? deja escribir texto para filtrar por nombre/username/email
    <TextInput source="q" alwaysOn />,
];

export const UserList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    return (
        <List filters={usersFilters}>
            {isSmall ? (
                <SimpleList
                    primaryText={(record) => record.name}
                    secondaryText={(record) => record.username}
                    tertiaryText={(record) => record.email}
                />
            ) : (
                <DataTable rowClick="show">
                    <DataTable.Col source="id" />
                    <DataTable.Col source="name" />
                    <DataTable.Col source="username" />
                    <DataTable.Col source="email">
                        <EmailField source="email" />
                    </DataTable.Col>
                    <DataTable.Col source="address.street" />
                    <DataTable.Col source="phone" />
                    <DataTable.Col source="website" />
                    <DataTable.Col source="company.name" />
                    <DataTable.Col>
                        <EditButton />
                    </DataTable.Col>
                </DataTable>
            )}
        </List>
    );
};

export const UserShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="username" />
            <EmailField source="email" />
            <TextField source="address.street" />
            <TextField source="address.suite" />
            <TextField source="address.city" />
            <TextField source="address.zipcode" />
            <TextField source="phone" />
            <TextField source="website" />
            <TextField source="company.name" />
            <TextField source="company.catchPhrase" />
        </SimpleShowLayout>
    </Show>
);

export const UserEdit = () => (
    <Edit>
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput disabled source="id" />
            <TextInput required source="name" />
            <TextInput required source="username" />
            <TextInput source="email" validate={required()} />
            <TextInput source="address.street" />
            <TextInput source="address.suite" />
            <TextInput source="address.city" />
            <TextInput source="address.zipcode" />
            <TextInput source="phone" />
            <TextInput source="website" />
            <TextInput source="company.name" />
        </SimpleForm>
    </Edit>
);

export const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput required source="name" />
            <TextInput required source="username" />
            <TextInput source="email" validate={required()} />
            <TextInput source="address.street" />
            <TextInput source="address.suite" />
            <TextInput source="address.city" />
            <TextInput source="address.zipcode" />
            <TextInput source="phone" />
            <TextInput source="website" />
            <TextInput source="company.name" />
        </SimpleForm>
    </Create>
);
