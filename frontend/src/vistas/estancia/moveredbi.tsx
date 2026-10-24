import { useParams } from "react-router-dom";
import {
  Edit, SimpleForm, Toolbar, SaveButton, RadioButtonGroupInput, ReferenceInput, SelectInput, DateInput,
  FormDataConsumer, required, useRecordContext, useNotify, useRedirect,
} from "react-admin";
import { Typography, Alert } from "@mui/material";

//* datos del niño arriba del formulario
const Encabezado = () => {
  const infante = useRecordContext();
  if (!infante) return null;
  return (
    <div>
      <Typography variant="h1">Mover de estancia o dar de baja</Typography>
      <Typography>
        {infante.nombre} {infante.paterno} {infante.materno} · Matrícula {infante.matricula} · EBDI actual: {infante.ebdi}
      </Typography>
      {infante.activo != 1 && (
        <Alert severity="info" role="status" sx={{ mt: 1 }}>
          Este infante ya no está inscrito, no se puede cambiar de estancia ni volver a dar de baja.
        </Alert>
      )}
    </div>
  );
};

//* campos según lo que se elija
const Campos = () => {
  const infante = useRecordContext();
  if (!infante) return null;
  if (infante.activo != 1) return null; // ya no está inscrito, no hay nada que hacer

  //^ la estancia de destino tiene que ser distinta a la actual
  const otraEstancia = (valor: number) => {
    if (valor == infante.ebdi) {
      return "Ya está en esta estancia, elige otra";
    }
    return undefined;
  };

  return (
    <>
      <RadioButtonGroupInput
        source="accion"
        label="¿Qué quieres hacer?"
        choices={[
          { id: "transferir", name: "Cambiar de estancia" },
          { id: "baja", name: "Dar de baja" },
        ]}
        validate={required()}
      />
      <FormDataConsumer>
        {({ formData }) => formData.accion == "transferir" && (
          <>
            {/* el personal de estancia ve el catálogo completo de estancias para poder escoger el destino */}
            <ReferenceInput source="ebdi" reference="estancias" perPage={100} sort={{ field: "numero", order: "ASC" }}>
              <SelectInput
                label="Estancia de destino"
                optionText={(e) => `${e.nombre} (${e.estado})`} // el nombre ya trae el número, ej. "EBDI 48 Monterrey"
                validate={[required(), otraEstancia]}
              />
            </ReferenceInput>
            <Alert severity="warning" role="status">
              Revisa bien la estancia de destino: al guardar, el personal de esta estancia ya no podrá ver ni
              modificar los datos de este infante. Si te equivocas, solo el administrador lo puede corregir.
            </Alert>
          </>
        )}
      </FormDataConsumer>
      <FormDataConsumer>
        {({ formData }) => formData.accion == "baja" && (
          <>
            <SelectInput
              source="motivoBaja"
              label="Motivo de la baja"
              choices={[
                { id: 1, name: "Egreso por edad" },
                { id: 2, name: "Cambio de domicilio o de trabajo" },
                { id: 3, name: "Decisión de la familia" },
                { id: 4, name: "Otro" },
              ]} // los mismos números que usa el backend
              validate={required()}
            />
            <DateInput source="fBaja" label="Fecha de la baja" helperText="Si la dejas vacía se usa la fecha de hoy." />
            <Alert severity="warning" role="status">
              Al dar de baja ya no se le podrán capturar medidas. Sus datos y su historial se conservan.
            </Alert>
          </>
        )}
      </FormDataConsumer>
    </>
  );
};

//* el botón de guardar solo aparece si el niño sigue inscrito
const Botones = () => {
  const infante = useRecordContext();
  if (!infante) return null;
  if (infante.activo != 1) return null;
  return (
    <Toolbar>
      <SaveButton label="Guardar movimiento" />
    </Toolbar>
  );
};

export const MoverEbdi = () => {
  const { id } = useParams();
  const notify = useNotify();
  const redirect = useRedirect();

  //^ solo se mandan los campos de lo que se eligió, así no se tocan los demás datos del niño
  const soloLoElegido = (data: any) => {
    if (data.accion == "transferir") {
      return { ebdi: data.ebdi };
    }
    let fecha = null; // si no ponen fecha, el backend usa la de hoy
    if (data.fBaja) {
      fecha = data.fBaja;
    }
    return { baja: 1, motivoBaja: data.motivoBaja, fBaja: fecha };
  };

  //^ después de guardar se avisa qué pasó y se regresa a la lista
  const alGuardar = (data: any) => {
    if (data.activo == 1) {
      notify(`Infante transferido a la EBDI ${data.ebdi}`, { type: "success" });
    } else {
      notify("Baja registrada", { type: "success" });
    }
    redirect("list", "infantes"); // después de transferirlo, la estancia anterior ya no puede abrir su ficha
  };

  return (
    <Edit
      resource="infantes"
      id={id}
      title="Mover de estancia o dar de baja"
      mutationMode="pessimistic" // espera la respuesta del backend, si hay error se muestra y no se sale
      transform={soloLoElegido}
      mutationOptions={{ onSuccess: alGuardar }}
    >
      <SimpleForm toolbar={<Botones />}>
        <Encabezado />
        <Campos />
      </SimpleForm>
    </Edit>
  );
};
