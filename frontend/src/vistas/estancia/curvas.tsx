import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { Show, TopToolbar, CreateButton, useRecordContext, useGetList, useGetOne, usePermissions } from "react-admin";
import { Card, CardContent, Typography, Alert, Table, TableHead, TableBody, TableRow, TableCell, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { edadTexto } from "./lista";
import { colores } from "../../theme";
import cdc from "../../datos/cdc.json";

type Punto = { x: number; y: number };
type Fila = { x: number; p3: number; p50: number; p97: number };

//* edad en meses entre dos fechas (mes promedio de 30.4375 días, igual que la CDC)
const mesesEntre = (desde: string, hasta: string) =>
  (new Date(hasta).getTime() - new Date(desde).getTime()) / (1000 * 60 * 60 * 24 * 30.4375);

//* valor de un percentil en x, interpolando entre las dos filas de la tabla que lo rodean
//  (la tabla cdc viene cada medio mes o cada centímetro, el niño casi nunca cae justo en una fila)
const percentilEn = (ref: Fila[], x: number, campo: "p3" | "p50" | "p97") => {
  for (let i = 0; i < ref.length - 1; i++) {
    const a = ref[i];
    const b = ref[i + 1];
    if (x >= a.x && x <= b.x) {
      const t = (x - a.x) / (b.x - a.x);
      return a[campo] + t * (b[campo] - a[campo]);
    }
  }
  return ref[ref.length - 1][campo];
};

type Props = {
  titulo: string;
  ejeX: string;
  ejeY: string;
  referencia: Fila[];
  puntos: Punto[];
  lectura: string;
};

//* IMC = peso (kg) / talla (m)², con un decimal
// TODO: pasarlo a back
const calcularImc = (peso: number, tallaCm: number) => Math.round((peso / (tallaCm / 100) ** 2) * 10) / 10;

//* tabla de referencia de IMC para la edad, armada con las dos tablas CDC que sí tenemos
//^ pesoTalla solo va de 77 a 121.5 cm, así que solo salen las edades en las que las tres tallas caben ahí
const tablaImc = (tallaEdad: Fila[], pesoTalla: Fila[]): Fila[] => {
  const min = pesoTalla[0].x;
  const max = pesoTalla[pesoTalla.length - 1].x;
  const imcDe = (fila: Fila, campo: "p3" | "p50" | "p97") => {
    const talla = fila[campo]; // talla de ese percentil a esa edad
    const peso = percentilEn(pesoTalla, talla, campo); // peso de ese percentil para esa talla
    return calcularImc(peso, talla);
  };
  return tallaEdad
    .filter((f) => f.p3 >= min && f.p97 <= max)
    .map((f) => ({ x: f.x, p3: imcDe(f, "p3"), p50: imcDe(f, "p50"), p97: imcDe(f, "p97") }));
};

export const Grafica = ({ titulo, ejeX, ejeY, referencia, puntos, lectura }: Props) => {
  const min = referencia[0].x;
  const max = referencia[referencia.length - 1].x;
  // se ordenan por x para que la línea del infante no se cruce
  const ordenados = [...puntos].sort((a, b) => a.x - b.x);
  const dentroDeTabla = ordenados.filter((p) => p.x >= min && p.x <= max);
  const ultimo = puntos[puntos.length - 1]; // la medición más reciente (vienen por fecha)
  const fueraDeTabla = ultimo ? ultimo.x < min || ultimo.x > max : false;
  const dentro = ultimo && !fueraDeTabla
    ? ultimo.y >= percentilEn(referencia, ultimo.x, "p3") && ultimo.y <= percentilEn(referencia, ultimo.x, "p97")
    : true;

  const linea = (campo: "p3" | "p50" | "p97") => referencia.map((f) => ({ x: f.x, y: f[campo] }));

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h2" component="h2">{titulo}</Typography>
        <div style={{ height: 320 }}>
          <Line
            data={{
              datasets: [
                { label: "Límite alto (percentil 97)", data: linea("p97"), borderColor: colores.grisOscuro, borderDash: [10, 5], pointRadius: 0 },
                { label: "Valor típico (percentil 50)", data: linea("p50"), borderColor: colores.verde, pointRadius: 0 },
                { label: "Límite bajo (percentil 3)", data: linea("p3"), borderColor: colores.grisOscuro, borderDash: [2, 4], pointRadius: 0 },
                { label: "Medidas del infante", data: dentroDeTabla, borderColor: colores.guinda, backgroundColor: colores.guinda, borderWidth: 4, pointStyle: "rectRot", pointRadius: 7 },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: "bottom",
                  labels: { usePointStyle: true, pointStyle: "line", pointStyleWidth: 40 },
                },
              },
              scales: {
                // el eje x se queda en el rango de la tabla, así las curvas no se aplastan
                x: { type: "linear", min, max, title: { display: true, text: ejeX } },
                y: { title: { display: true, text: ejeY } },
              },
            }}
          />
        </div>
        <Typography sx={{ mb: 1 }}>{lectura}</Typography>
        {!ultimo ? (
          <Alert severity="info" role="status">Todavía no hay mediciones</Alert>
        ) : fueraDeTabla ? (
          <Alert severity="info" role="status">
            La tabla de referencia va de {min} a {max}, la medición más reciente queda fuera
          </Alert>
        ) : (
          <Alert severity={dentro ? "success" : "warning"} role="status">
            {dentro ? "Dentro del rango esperado" : "Fuera del rango esperado, conviene revisarlo"}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

const Graficas = () => {
  const infante = useRecordContext();
  const { data: mediciones } = useGetList(
    "mediciones",
    {
      filter: { infanteId: infante?.id },
      sort: { field: "fecha", order: "ASC" },
      pagination: { page: 1, perPage: 1000 }, // por defecto solo trae 25
    },
    { enabled: !!infante },
  );
  //^ la región (UR) sale de la estancia del infante
  const { data: estancia } = useGetOne("estancias", { id: infante?.ebdi }, { enabled: !!infante });

  if (!infante) return null;

  // en la data nueva "M" = mujer y "H" = hombre; la cdc usa "1" = niño y "2" = niña
  const sexo = infante.genero === "M" ? "2" : "1";
  const lista = mediciones ?? [];
  const edad = (m: any) => mesesEntre(infante.fnac, m.fecha);

  //* 1 = hombres, 2 = mujeres. x= valor, p3 = min, p50 = media, p97 = max*/
  return (
    <div>
      <Typography variant="h1">{infante.nombre} {infante.paterno} {infante.materno}</Typography>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h2">Datos del infante</Typography>
          <Typography>Matrícula: {infante.matricula} · EBDI: {infante.ebdi} · Región: {estancia?.region || "—"}</Typography>
          <Typography>Sexo: {infante.genero === "M" ? "Mujer" : "Hombre"} · CURP: {infante.curp || "—"}</Typography>
          <Typography>
            Nacimiento: {new Date(infante.fnac).toLocaleDateString("es-MX", { timeZone: "UTC" })} · Edad: {edadTexto(infante.fnac)}
          </Typography>
          <Typography>Estatus: {infante.activo === 1 ? "Inscrito" : "Ya no está inscrito"}</Typography>
          <Typography>
            Talla blanco familiar: {infante.tallaBlancoFamiliar != null ? `${infante.tallaBlancoFamiliar} cm` : "—"}
            {infante.tallaBlancoFamiliar != null && (infante.tallaMama == null || infante.tallaPapa == null) &&
              " (calculada con la talla promedio en México porque falta la de la mamá o el papá)"}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h2">Historial de mediciones</Typography>
          {lista.length === 0 ? (
            <Alert severity="info" role="status">Todavía no hay mediciones</Alert>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Edad</TableCell>
                  <TableCell>Peso (kg)</TableCell>
                  <TableCell>Talla (cm)</TableCell>
                  <TableCell>Perímetro cefálico (cm)</TableCell>
                  <TableCell>Índice de Masa corporal (kg/m²)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...lista].reverse().map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{new Date(m.fecha).toLocaleDateString("es-MX", { timeZone: "UTC" })}</TableCell>
                    <TableCell>{Math.floor(edad(m) / 12)} a {Math.floor(edad(m) % 12)} m</TableCell>
                    <TableCell>{m.peso}</TableCell>
                    <TableCell>{m.talla}</TableCell>
                    <TableCell>{m.perimetroCefalico ?? "—"}</TableCell>
                    <TableCell>{m.peso != null && m.talla != null ? calcularImc(m.peso, m.talla) : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Grafica
        titulo="Peso para la talla"
        ejeX="Talla (cm)"
        ejeY="Peso (kg)"
        referencia={cdc.pesoTalla[sexo]}
        puntos={lista.map((m) => ({ x: m.talla, y: m.peso }))}
        lectura="Muestra si el peso es adecuado para la estatura (CDC, de 77 a 121.5 cm)."
      />
      <Grafica
        titulo="Talla para la edad"
        ejeX="Edad (meses)"
        ejeY="Talla (cm)"
        referencia={cdc.tallaEdad[sexo]}
        puntos={lista.map((m) => ({ x: edad(m), y: m.talla }))}
        lectura="Muestra si la talla es la esperada para su edad (CDC, de 0 a 36 meses)."
      />
      <Grafica
        titulo="Índice de masa corporal (IMC) para la edad"
        ejeX="Edad (meses)"
        ejeY="IMC (kg/m²)"
        referencia={tablaImc(cdc.tallaEdad[sexo], cdc.pesoTalla[sexo])}
        puntos={lista.filter((m) => m.peso != null && m.talla != null).map((m) => ({ x: edad(m), y: calcularImc(m.peso, m.talla) }))}
        lectura="Muestra si el peso es proporcional a la estatura para su edad. Las curvas de referencia se calcularon con las tablas CDC de talla para la edad y peso para la talla (aproximación, desde los 19.5 meses en niños y 21.5 en niñas)."
      />
    </div>
  );
};

const TomarMedidas = () => {
  const infante = useRecordContext();
  const { permissions } = usePermissions();
  // solo estancia y admin pueden capturar
  if (!infante || (permissions != "estancia")) return null;
  return (
    <CreateButton
      resource="mediciones"
      label="Tomar medidas"
      state={{ record: { infanteId: infante.id } }}
    />
  );
};

//* botón al formulario de mover de estancia o dar de baja (estancia y admin, solo si sigue inscrito)
const MoverOBaja = () => {
  const infante = useRecordContext();
  const { permissions } = usePermissions();
  if (!infante || infante.activo != 1 || (permissions != "estancia" && permissions != "admin")) return null;
  return (
    <Button component={Link} to={`/infantes/${infante.id}/movimiento`} size="small">
      Mover o dar de baja
    </Button>
  );
};

export const InfanteCurvas = () => (
  <Show title="Curvas de crecimiento" actions={<TopToolbar><TomarMedidas /><MoverOBaja /></TopToolbar>}>
    <Graficas />
  </Show>
);