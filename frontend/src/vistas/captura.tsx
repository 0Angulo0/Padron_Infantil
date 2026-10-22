import {
  Create, SimpleForm, TextInput, DateInput, NumberInput,
  required, minValue, maxValue,
} from "react-admin";
import { Card, CardContent, Typography } from "@mui/material";

//? tarjeta lateral con recordatorios, igual que el mockup
const AntesDeGuardar = () => (
  <Card sx={{ ml: 2, width: 300 }}>
    <CardContent>
      <Typography variant="h2" component="h2">Antes de guardar</Typography>
      <Typography>Revisa que la fecha sea la de hoy.</Typography>
      <Typography>Pesa al niño o niña sin zapatos ni ropa gruesa.</Typography>
      <Typography>Confirma que los números tengan punto decimal.</Typography>
    </CardContent>
  </Card>
);

//& fecha de hoy en formato año-mes-día, para que el campo salga ya lleno
const hoy = new Date().toLocaleDateString("en-CA");

export const MedicionCreate = () => (
  <Create aside={<AntesDeGuardar />} redirect={false} title="Capturar medidas">
    <SimpleForm>
      <TextInput
        source="matricula"
        label="Matrícula del infante"
        helperText="Ejemplo: PI-02481"
        validate={required()}
      />
      <DateInput
        source="fecha"
        label="Fecha de medición"
        defaultValue={hoy}
        helperText="Escribe día, mes y año."
        validate={required()}
      />
      <NumberInput
        source="peso"
        label="Peso (kg)"
        step={0.1}
        helperText="Usa punto decimal. Ejemplo: 14.4"
        validate={[required(), minValue(1, "El peso debe ser de al menos 1 kg"), maxValue(40, "El peso no puede pasar de 40 kg")]}
      />
      <NumberInput
        source="talla"
        label="Talla (cm)"
        step={0.1}
        helperText="Mide de pie si ya camina."
        validate={[required(), minValue(40, "La talla debe ser de al menos 40 cm"), maxValue(130, "La talla no puede pasar de 130 cm")]}
      />      <NumberInput
        source="perimetroCefalico"
        label="Perímetro cefálico (cm)"
        step={0.1}
        helperText="Mide alrededor de la frente."
        validate={[required(), minValue(30, "Debe ser de al menos 30 cm"), maxValue(60, "No puede pasar de 60 cm")]}
      />
    </SimpleForm>
  </Create>
);