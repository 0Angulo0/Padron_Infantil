import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Create, SimpleForm, TextInput, DateInput, SelectInput, NumberInput, required, maxLength, 
  minValue, maxValue, usePermissions,
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
        {permissions == "admin" && <NumberInput source="ebdi" label="EBDI" validate={required()} />}
        <NumberInput source="matricula" label="Matrícula" validate={required()} />
        <TextInput source="nombre" label="Nombre(s)" validate={required()} />
        <TextInput source="paterno" label="Apellido paterno" validate={required()} />
        <TextInput source="materno" label="Apellido materno" />
        <DateInput source="fnac" label="Fecha de nacimiento" validate={required()} />
        <SelectInput
          source="genero"
          label="Sexo"
          choices={[{ id: "M", name: "Mujer" }, { id: "H", name: "Hombre" }]} 
          validate={required()}
        />
        <TextInput source="curp" label="CURP" validate={maxLength(18)} />
        <NumberInput
          source="tallaMama"
          label="Talla de la mamá (cm)"
          step={0.1}
          helperText="Si no la conoces, déjala vacía y se usa la talla promedio en México (162 cm)."
          validate={[minValue(110, "Mínimo 110 cm"), maxValue(220, "Máximo 220 cm")]}
        />
        <NumberInput
          source="tallaPapa"
          label="Talla del papá (cm)"
          step={0.1}
          helperText="Si no la conoces, déjala vacía y se usa la talla promedio en México (170 cm)."
          validate={[minValue(110, "Mínimo 110 cm"), maxValue(220, "Máximo 220 cm")]}
        />
        <TextInput source="tutorNombre" label="Padre, madre o tutor" validate={required()} />
        <TextInput source="tutorCiudad" label="Ciudad" validate={required()} />
      </SimpleForm>
    </Create>
  );
};