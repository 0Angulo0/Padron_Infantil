import {
  List, DataTable, DateField, SelectField, CreateButton, ReferenceField, TextField, useRecordContext, useGetList
} from "react-admin";
import { Link } from "react-router-dom";
import { Button, Alert } from "@mui/material";


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
    <span onClick={parar} >
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
      {infante.activo == 1 && (
        <Button size="small" component={Link} to={`/infantes/${infante.id}/movimiento`}>
          Mover o dar de baja
        </Button>
      )}
    </span>
  );
};

//* días que han pasado desde x fecha hasta hoy
const DIAS_SIN_MEDIR = 45; //lo pongo aca por si después lo quieren cambiar
const diasDesde = (fecha: string) => {
  const ms = Date.now() - new Date(fecha).getTime(); 
  return Math.floor(ms / (1000 * 60 * 60 * 24)); 
};

//? true si ya pasaron 45 días o más, o si nunca lo han medido
const tocaMedir = (ultimaMedicion: string | null) => {
  if (ultimaMedicion == null) { // nunca lo han medido
    return true;
  }
  if (diasDesde(ultimaMedicion) >= DIAS_SIN_MEDIR) { // ya pasaron 45 días o más
    return true;
  }
  return false; // su medición está al día
};

//* columna ultima medicion, la fecha y hace cuántos días
const UltimaMedicionField = () => {  
  const infante = useRecordContext();
  if (!infante)  // sino lo marca como undefined y no compila
    return null;
  if (infante.ultimaMedicion == null) {  //caso 1: el niño no tiene mediciones
    return <span style={{ color: "#b3261e", fontWeight: "bold" }}> Sin mediciones </span>;
  }
  const fecha = new Date(infante.ultimaMedicion).toLocaleDateString("es-MX", { timeZone: "UTC" });
  const dias = diasDesde(infante.ultimaMedicion);
  const hace = dias == 0 ? "hoy" : dias == 1 ? "hace 1 día" : `hace ${dias} días`;  //solo es para que esté bien escrito
  if (tocaMedir(infante.ultimaMedicion)) {  //caso 2: el niño 
    return <span style={{ color: "#b3261e", fontWeight: "bold" }}>{fecha} ({hace}, toca medir)</span>;
  }
  return <span>{fecha} ({hace})</span>;
};

//* aviso arriba de la lista, fácil de ver y darles el seguimiento necesario
const AvisoPendientes = () => {
  const { data } = useGetList("infantes", { filter: { activo: 1 }, pagination: { page: 1, perPage: 1000 } });
  if (!data) // aun no llegan los datos y sigue cargando
    return null;

  const pendientes = data.filter((infante) => tocaMedir(infante.ultimaMedicion)); //usamos el bool con cada niño
  if (pendientes.length == 0) {  // todas al día
    return <Alert severity="success" role="status" sx={{ mt: 2 }}>Todos los infantes tienen su medición al día.</Alert>;
  }
  const nombres = pendientes.map((infante) => `${infante.nombre} ${infante.paterno}`).join(", ");
  return (  // hay niños que ocupan seguimiento
    <Alert severity="warning" role="status" sx={{ mt: 2 }}>
      {pendientes.length} {pendientes.length == 1 ? "infante lleva" : "infantes llevan"} {DIAS_SIN_MEDIR} días o más sin medición: {nombres}.
    </Alert>
  );
};

//* región (UR) del infante: no se guarda en el infante, sale de su estancia (ebdi → estancias.region)
export const RegionField = () => (
  <ReferenceField source="ebdi" reference="estancias" link={false}>
    <TextField source="region" />
  </ReferenceField>
);

//* regiones para los filtros
export const regiones = [
  { id: "Norte", name: "Norte" },
  { id: "Centro", name: "Centro" },
  { id: "Oeste", name: "Oeste" },
  { id: "Este", name: "Este" },
  { id: "Sur", name: "Sur" },
];

const EdadField = () => {
  const infante = useRecordContext();
  return infante ? <>{edadTexto(infante.fnac)}</> : null;
};

export const InfanteList = () => (
  <>
  <AvisoPendientes />
  <List filter={{ activo: 1 }} actions={<CreateButton label="Registrar infante" />}>
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
      {/* disableSort: la fecha la calcula el backend al responder, no está guardada en la base y no se puede ordenar */}
      <DataTable.Col source="ultimaMedicion" label="Última medición" disableSort>
        <UltimaMedicionField />
      </DataTable.Col>
      <DataTable.Col label="Acciones">
        <Acciones />
      </DataTable.Col>
    </DataTable>
  </List>
  </>
);
