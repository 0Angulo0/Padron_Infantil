import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { Show, TopToolbar, CreateButton, useRecordContext, useGetList, usePermissions } from "react-admin";
import { Card, CardContent, Typography, Alert, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import { edadTexto } from "./lista";
import { colores } from "../../theme";
import cdc from "../../datos/cdc.json";

type Punto = { x: number; y: number };
type Fila = { x: number; p3: number; p50: number; p97: number };

const mesesEntre = (desde: string, hasta: string) =>
  (new Date(hasta).getTime() - new Date(desde).getTime()) / (1000 * 60 * 60 * 24 * 30.4375);

type Props = {
  titulo: string;
  ejeX: string;
  ejeY: string;
  referencia: Fila[];
  puntos: Punto[];
  lectura: string;
};

export const Grafica = ({ titulo, ejeX, ejeY, referencia, puntos, lectura }: Props) => {
  const ultimo = puntos[puntos.length - 1];
  const cercana = ultimo
    ? referencia.reduce((a, b) => (Math.abs(b.x - ultimo.x) < Math.abs(a.x - ultimo.x) ? b : a))
    : undefined;
  const dentro = ultimo && cercana ? ultimo.y >= cercana.p3 && ultimo.y <= cercana.p97 : true;
  // la tabla cdc no cubre todas las edades/tallas, fuera de ella no se puede decir si está bien
  const fueraDeTabla = ultimo ? ultimo.x < referencia[0].x || ultimo.x > referencia[referencia.length - 1].x : false;

  const linea = (campo: "p3" | "p50" | "p97") => referencia.map((f) => ({ x: f.x, y: f[campo] }));

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h2" component="h2">{titulo}</Typography>
        <div style={{ height: 320 }}>
          <Line
            data={{
              datasets: [
                { label: "P97", data: linea("p97"), borderColor: colores.grisOscuro, borderDash: [10, 5], pointRadius: 0 },
                { label: "P50", data: linea("p50"), borderColor: colores.verde, pointRadius: 0 },
                { label: "P3", data: linea("p3"), borderColor: colores.grisOscuro, borderDash: [2, 4], pointRadius: 0 },
                { label: "Infante", data: puntos, borderColor: colores.guinda, borderWidth: 4, pointStyle: "rectRot", pointRadius: 7 },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { type: "linear", title: { display: true, text: ejeX } },
                y: { title: { display: true, text: ejeY } },
              },
            }}
          />
        </div>
        <Typography>P97: guiones largos · P50: línea continua · P3: puntos · Infante: línea gruesa con rombos</Typography>
        <Typography sx={{ mb: 1 }}>{lectura}</Typography>
        {fueraDeTabla ? (
          <Alert severity="info" role="status">
            La tabla de referencia va de {referencia[0].x} a {referencia[referencia.length - 1].x}, esta medición queda fuera
          </Alert>
        ) : ultimo ? (
          <Alert severity={dentro ? "success" : "warning"} role="status">
            {dentro ? "Dentro del rango esperado" : "Fuera del rango esperado, conviene revisarlo"}
          </Alert>
        ) : (
          <Alert severity="info" role="status">Todavía no hay mediciones</Alert>
        )}
      </CardContent>
    </Card>
  );
};

const Graficas = () => {
  const infante = useRecordContext();
  const { data: mediciones } = useGetList("mediciones", {
    filter: { id_infante: infante?.id },
    sort: { field: "fecha", order: "ASC" },
  });

  if (!infante) return null;

  const sexo = infante.genero === "F" ? "2" : "1";
  const lista = mediciones ?? [];
  const edad = (m: any) => mesesEntre(infante.fnac, m.fecha);

  return (
    <div>
            <Typography variant="h1">{infante.nombre} {infante.paterno} {infante.materno}</Typography>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h2">Datos del infante</Typography>
          <Typography>Matrícula: {infante.matricula} · EBDI: {infante.ebdi} · UR: {infante.ur || "—"}</Typography>
          <Typography>Sexo: {infante.genero === "F" ? "Femenino" : "Masculino"} · CURP: {infante.curp || "—"}</Typography>
          <Typography>
            Nacimiento: {new Date(infante.fnac).toLocaleDateString("es-MX", { timeZone: "UTC" })} · Edad: {edadTexto(infante.fnac)}
          </Typography>
          <Typography>Estatus: {infante.activo === 1 ? "Inscrito" : "Ya no está inscrito"}</Typography>
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
                  <TableCell>Talla blanco familiar (cm)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...lista].reverse().map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{new Date(m.fecha).toLocaleDateString("es-MX", { timeZone: "UTC" })}</TableCell>
                    <TableCell>{Math.floor(edad(m) / 12)} a {Math.floor(edad(m) % 12)} m</TableCell>
                    <TableCell>{m.peso}</TableCell>
                    <TableCell>{m.talla}</TableCell>
                    <TableCell>{m.perimetro_cefalico}</TableCell>
                    <TableCell>{m.talla_blanco_familiar ?? "—"}</TableCell>
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
        lectura="Muestra si el peso es adecuado para la estatura."
      />
      <Grafica
        titulo="Talla para la edad"
        ejeX="Edad (meses)"
        ejeY="Talla (cm)"
        referencia={cdc.tallaEdad[sexo]}
        puntos={lista.map((m) => ({ x: edad(m), y: m.talla }))}
        lectura="Muestra si la talla es la esperada para su edad."
      />
      <Grafica
        titulo="Perímetro cefálico para la edad"
        ejeX="Edad (meses)"
        ejeY="Perímetro cefálico (cm)"
        referencia={cdc.perimetroEdad[sexo]}
        puntos={lista.map((m) => ({ x: edad(m), y: m.perimetro_cefalico }))}
        lectura="Muestra si el crecimiento de la cabeza es el esperado para su edad."
      />
    </div>
  );
};

const TomarMedidas = () => {
  const infante = useRecordContext();
  const { permissions } = usePermissions();
  // solo estancia y admin pueden capturar
  if (!infante || (permissions != "estancia" && permissions != "admin")) return null;
  return (
    <CreateButton
      resource="mediciones"
      label="Tomar medidas"
      state={{ record: { id_infante: infante.id } }}
    />
  );
};

export const InfanteCurvas = () => (
  <Show title="Curvas de crecimiento" actions={<TopToolbar><TomarMedidas /></TopToolbar>}>
    <Graficas />
  </Show>
);