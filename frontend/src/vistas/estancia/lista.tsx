import { List, DataTable, DateField, SelectField, CreateButton, useRecordContext } from "react-admin";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";


//* edad en años y meses a partir de la fecha de nacimiento
export const edadTexto = (fnac: string) => {
  const hoy = new Date();
  const n = new Date(fnac);
  let meses = (hoy.getFullYear() - n.getUTCFullYear()) * 12 + (hoy.getMonth() - n.getUTCMonth());
  if (hoy.getDate() < n.getUTCDate()) meses -= 1;
  if (meses < 0) meses = 0;
  const a = Math.floor(meses / 12);
  const m = meses % 12;
  return `${a} ${a === 1 ? "año" : "años"} ${m} ${m === 1 ? "mes" : "meses"}`;
};

//? los botones están dentro de una fila clicable, por eso se frena el clic para que no abra el detalle dos veces
const Acciones = () => {
  const infante = useRecordContext();
  if (!infante) return null;
  const parar = (e: React.MouseEvent) => e.stopPropagation();
  return (
    <span onClick={parar}>
      <Button size="small" component={Link} to={`/infantes/${infante.id}/show`}>
        Ver datos y medidas
      </Button>
      <Button
        size="small"
        component={Link}
        to="/mediciones/create"
        state={{ record: { infanteId: infante.id } }}
      >
        Tomar medidas
      </Button>
    </span>
  );
};

const EdadField = () => {
  const infante = useRecordContext();
  return infante ? <>{edadTexto(infante.fnac)}</> : null;
};

export const InfanteList = () => (
  <List actions={<CreateButton label="Registrar infante" />}>
    <DataTable rowClick="show" bulkActionButtons={false}>
      <DataTable.Col source="matricula" label="Matrícula" />
      <DataTable.Col source="nombre" label="Nombre" />
      <DataTable.Col source="paterno" label="Apellido paterno" />
      <DataTable.Col source="materno" label="Apellido materno" />
      <DataTable.Col source="genero" label="Sexo">
        <SelectField source="genero" choices={[{ id: "M", name: "Mujer" }, { id: "H", name: "Hombre" }]} />
      </DataTable.Col>
      <DataTable.Col source="fnac" label="Nacimiento">
        <DateField source="fnac" locales="es-MX" options={{ timeZone: "UTC" }} />
      </DataTable.Col>
      <DataTable.Col label="Edad">
        <EdadField />
      </DataTable.Col>
      <DataTable.Col label="Acciones">
        <Acciones />
      </DataTable.Col>
    </DataTable>
  </List>
);