import {
  Create, SimpleForm, ReferenceInput, SelectInput, DateInput, NumberInput,
  required, minValue, maxValue,
} from "react-admin";
import { Typography } from "@mui/material";

const hoy = new Date().toLocaleDateString("en-CA");

export const MedicionCreate = () => (
  <Create title="Capturar medidas" redirect={() => "infantes"}>
    <SimpleForm>
      <Typography variant="h1">Capturar medidas</Typography>

      {/* solo los inscritos: a un niño dado de baja el backend no le deja capturar medidas */}
      <ReferenceInput source="infanteId" reference="infantes" perPage={500} filter={{ activo: 1 }}>
        <SelectInput
          label="Infante"
          optionText={(i) => `${i.nombre} ${i.paterno} ${i.materno}`}
          validate={required()}
        />
      </ReferenceInput>

      <DateInput source="fecha" label="Fecha de medición" defaultValue={hoy} validate={required()} />

      <NumberInput
        source="peso"
        label="Peso (kg)"
        step={0.1}
        helperText="Usa punto decimal. Ejemplo: 14.4"
        validate={[required(), minValue(1, "Mínimo 1 kg"), maxValue(40, "Máximo 40 kg")]}
      />
      <NumberInput
        source="talla"
        label="Talla (cm)"
        step={0.1}
        helperText="Mide de pie si ya camina."
        validate={[required(), minValue(40, "Mínimo 40 cm"), maxValue(130, "Máximo 130 cm")]}
      />
      <NumberInput
        source="tallaBlancoFamiliar"
        label="Talla blanco familiar (cm)"
        step={0.1}
        helperText="Estatura esperada según la de la madre y el padre."
        validate={[required(), minValue(140, "Mínimo 140 cm"), maxValue(200, "Máximo 200 cm")]}
      />
      <NumberInput
        source="perimetroCefalico"
        label="Perímetro cefálico (cm)"
        step={0.1}
        helperText="Mide alrededor de la frente."
        validate={[required(), minValue(30, "Mínimo 30 cm"), maxValue(60, "Máximo 60 cm")]}
      />
    </SimpleForm>
  </Create>
);