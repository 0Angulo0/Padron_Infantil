import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Create, SimpleForm, TextInput, DateInput, SelectInput, NumberInput, required, maxLength, usePermissions,
} from "react-admin";
import { Typography, Alert, Button } from "@mui/material";

export const InfanteCreate = () => {
  const [clave, setClave] = useState("");
  const { permissions } = usePermissions();

  if (clave) {
    return (
      <div>
        <Typography variant="h1">Infante registrado</Typography>
        <Alert severity="success" role="status">
          Clave de acceso de la familia: {clave}. Solo se muestra esta vez, anótala.
        </Alert>
        <Button component={Link} to="/infantes" variant="contained">Volver a la lista</Button>
      </div>
    );
  }

  return (
    <Create
      title="Registrar infante"
      redirect={false}
      mutationOptions={{ onSuccess: (data: any) => setClave(data.claveAcceso) }}
    >
      <SimpleForm>
        {/* a la estancia el backend le pone su ebdi, el admin la tiene que elegir */}
        {permissions == "admin" && <NumberInput source="ebdi" label="EBDI" validate={required()} />}
        {permissions == "admin" && <TextInput source="ur" label="UR" validate={maxLength(3)} />}
        <NumberInput source="matricula" label="Matrícula" validate={required()} />
        <TextInput source="nombre" label="Nombre(s)" validate={required()} />
        <TextInput source="paterno" label="Apellido paterno" validate={required()} />
        <TextInput source="materno" label="Apellido materno" />
        <DateInput source="fnac" label="Fecha de nacimiento" validate={required()} />
        <SelectInput
          source="genero"
          label="Sexo"
          choices={[{ id: "M", name: "Mujer" }, { id: "H", name: "Hombre" }]} // como en la CURP y en la tabla padron del socio
          validate={required()}
        />
        <TextInput source="curp" label="CURP" validate={maxLength(18)} />
        <TextInput source="tutorNombre" label="Padre, madre o tutor" validate={required()} />
        <TextInput source="tutorCiudad" label="Ciudad" validate={required()} />
      </SimpleForm>
    </Create>
  );
};