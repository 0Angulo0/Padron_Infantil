import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useGetList, useGetOne } from "react-admin";
import {
  Card, CardContent, Typography, Alert, AlertTitle,
  Table, TableHead, TableBody, TableRow, TableCell,
} from "@mui/material";
import { colores } from "../theme";

type Infante = {
  id: number;
  nombre: string;
  matricula: string;
  fechaNacimiento: string;
};

type Medicion = {
  id: number;
  infanteId: number;
  fecha: string;
  peso: number;
  talla: number;
  perimetro: number;
};

type Historia = {
  id: number;
  infanteId: number;
  fecha: string;
  nota: string;
};

type Punto = { x: number; bajo: number; medio: number; alto: number };

const infanteId = 1;

const infanteEjemplo: Infante = {
  id: 1,
  nombre: "Sofía Martínez López",
  matricula: "PI-02481",
  fechaNacimiento: "2024-03-10",
};

const medicionesEjemplo: Medicion[] = [
  { id: 1, infanteId: 1, fecha: "2025-03-10", peso: 10.6, talla: 75.0, perimetro: 45.8 },
  { id: 2, infanteId: 1, fecha: "2025-09-10", peso: 12.2, talla: 81.5, perimetro: 47.0 },
  { id: 3, infanteId: 1, fecha: "2026-03-10", peso: 13.1, talla: 86.5, perimetro: 48.0 },
  { id: 4, infanteId: 1, fecha: "2026-09-10", peso: 14.4, talla: 91.4, perimetro: 49.2 },
];

const historiaEjemplo: Historia[] = [
  { id: 1, infanteId: 1, fecha: "2025-03-10", nota: "Ingreso a la estancia. Sin alergias conocidas." },
  { id: 2, infanteId: 1, fecha: "2026-02-15", nota: "Esquema de vacunación al corriente." },
];

const pesoParaTalla: Punto[] = [
  { x: 70, bajo: 7.3, medio: 8.8, alto: 10.6 },
  { x: 80, bajo: 9.0, medio: 10.8, alto: 13.0 },
  { x: 90, bajo: 10.8, medio: 12.9, alto: 15.5 },
  { x: 100, bajo: 12.8, medio: 15.3, alto: 18.4 },
  { x: 110, bajo: 15.0, medio: 18.0, alto: 21.7 },
];

const tallaParaEdad: Punto[] = [
  { x: 1, bajo: 71.0, medio: 76.0, alto: 81.0 },
  { x: 2, bajo: 82.0, medio: 87.5, alto: 93.0 },
  { x: 3, bajo: 89.0, medio: 95.0, alto: 101.0 },
  { x: 4, bajo: 95.0, medio: 102.0, alto: 108.5 },
  { x: 5, bajo: 101.0, medio: 109.0, alto: 116.0 },
];

const imcParaEdad: Punto[] = [
  { x: 1, bajo: 14.8, medio: 17.2, alto: 19.5 },
  { x: 2, bajo: 14.0, medio: 16.0, alto: 18.5 },
  { x: 3, bajo: 13.6, medio: 15.5, alto: 17.8 },
  { x: 4, bajo: 13.4, medio: 15.3, alto: 17.5 },
  { x: 5, bajo: 13.3, medio: 15.2, alto: 17.7 },
];

const calcularEdad = (nacimiento: string, fecha: string) => {
  const dias = (new Date(fecha).getTime() - new Date(nacimiento).getTime()) / (1000 * 60 * 60 * 24);
  return Math.round((dias / 365.25) * 10) / 10;
};

const calcularImc = (m: Medicion) => Math.round((m.peso / ((m.talla / 100) * (m.talla / 100))) * 10) / 10;

const estadoDe = (referencia: Punto[], x: number, y: number) => {
  let cercano = referencia[0];
  referencia.forEach((r) => {
    if (Math.abs(r.x - x) < Math.abs(cercano.x - x)) {
      cercano = r;
    }
  });
  if (y < cercano.bajo) return "bajo";
  if (y > cercano.alto) return "alto";
  return "dentro";
};

export const Tutor = () => {
  const { data: dataInfante } = useGetOne<Infante>("infantes", { id: infanteId });
  const { data: dataMediciones } = useGetList<Medicion>("mediciones", {
    filter: { infanteId: infanteId },
    sort: { field: "fecha", order: "ASC" },
  });
  const { data: dataHistoria } = useGetList<Historia>("historiaClinica", {
    filter: { infanteId: infanteId },
    sort: { field: "fecha", order: "DESC" },
  });

  const infante = dataInfante ? dataInfante : infanteEjemplo;
  const mediciones = dataMediciones && dataMediciones.length > 0 ? dataMediciones : medicionesEjemplo;
  const historia = dataHistoria && dataHistoria.length > 0 ? dataHistoria : historiaEjemplo;

  const nombre = infante.nombre.split(" ")[0];
  const edadDe = (m: Medicion) => calcularEdad(infante.fechaNacimiento, m.fecha);
  const ultima = mediciones[mediciones.length - 1];
  const edadActual = calcularEdad(infante.fechaNacimiento, new Date().toISOString());

  const graficas = [
    {
      titulo: `Peso de ${nombre} según su estatura`,
      ejeX: "Estatura (cm)",
      ejeY: "Peso (kg)",
      referencia: pesoParaTalla,
      puntos: mediciones.map((m) => ({ x: m.talla, y: m.peso })),
      lectura: `Muestra si el peso de ${nombre} es adecuado para lo que mide. Si la línea gruesa va entre las dos líneas grises, todo va bien.`,
    },
    {
      titulo: `Estatura de ${nombre} según su edad`,
      ejeX: "Edad (años)",
      ejeY: "Estatura (cm)",
      referencia: tallaParaEdad,
      puntos: mediciones.map((m) => ({ x: edadDe(m), y: m.talla })),
      lectura: `Muestra si ${nombre} está creciendo como se espera. La línea gruesa debe subir de forma parecida a la línea verde.`,
    },
    {
      titulo: `Proporción entre peso y estatura de ${nombre}`,
      ejeX: "Edad (años)",
      ejeY: "Proporción (IMC)",
      referencia: imcParaEdad,
      puntos: mediciones.map((m) => ({ x: edadDe(m), y: calcularImc(m) })),
      lectura: `Muestra si el peso de ${nombre} es proporcional a su estatura. Si la línea gruesa sale del espacio entre las líneas grises, platiquen con el personal de la estancia.`,
    },
  ];

  let fueraDeRango = 0;
  graficas.forEach((g) => {
    const p = g.puntos[g.puntos.length - 1];
    if (estadoDe(g.referencia, p.x, p.y) !== "dentro") {
      fueraDeRango = fueraDeRango + 1;
    }
  });

  return (
    <div>
      <Typography variant="h1">Crecimiento de {nombre}</Typography>
      <Typography>Matrícula {infante.matricula} · {edadActual} años</Typography>

      <Alert severity={fueraDeRango === 0 ? "success" : "warning"} role="status">
        <AlertTitle>
          {fueraDeRango === 0 ? "Crecimiento adecuado para su edad" : "Conviene revisar el crecimiento"}
        </AlertTitle>
        {fueraDeRango === 0
          ? `${nombre} va como se espera para su edad. Sigan con sus revisiones en la estancia.`
          : `Platiquen con el personal de la estancia para revisar cómo va ${nombre}.`}
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="h2">Medición reciente</Typography>
          <Typography>Fecha: {ultima.fecha}</Typography>
          <Typography>Peso: {ultima.peso} kg</Typography>
          <Typography>Estatura: {ultima.talla} cm</Typography>
          <Typography>Perímetro de la cabeza: {ultima.perimetro} cm</Typography>
        </CardContent>
      </Card>

      {graficas.map((g) => (
        <Card key={g.titulo}>
          <CardContent>
            <Typography variant="h2">{g.titulo}</Typography>
            <div style={{ height: 300 }}>
              <Line
                data={{
                  datasets: [
                    {
                      label: "Máximo esperado",
                      data: g.referencia.map((r) => ({ x: r.x, y: r.alto })),
                      borderColor: colores.grisOscuro,
                      borderDash: [10, 5],
                      pointStyle: "rect",
                    },
                    {
                      label: "Promedio",
                      data: g.referencia.map((r) => ({ x: r.x, y: r.medio })),
                      borderColor: colores.verde,
                      pointStyle: "circle",
                    },
                    {
                      label: "Mínimo esperado",
                      data: g.referencia.map((r) => ({ x: r.x, y: r.bajo })),
                      borderColor: colores.grisOscuro,
                      borderDash: [2, 4],
                      pointStyle: "triangle",
                    },
                    {
                      label: nombre,
                      data: g.puntos,
                      borderColor: colores.guinda,
                      borderWidth: 4,
                      pointStyle: "rectRot",
                      pointRadius: 7,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { usePointStyle: true } } },
                  scales: {
                    x: { type: "linear", title: { display: true, text: g.ejeX } },
                    y: { title: { display: true, text: g.ejeY } },
                  },
                }}
              />
            </div>
            <Typography>Cómo leerla: {g.lectura}</Typography>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent>
          <Typography variant="h2">Historial de mediciones</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Edad</TableCell>
                <TableCell>Peso (kg)</TableCell>
                <TableCell>Estatura (cm)</TableCell>
                <TableCell>Perímetro de la cabeza (cm)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mediciones.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.fecha}</TableCell>
                  <TableCell>{edadDe(m)} años</TableCell>
                  <TableCell>{m.peso}</TableCell>
                  <TableCell>{m.talla}</TableCell>
                  <TableCell>{m.perimetro}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h2">Historial de salud</Typography>
          {historia.length === 0 ? (
            <Typography>Todavía no hay notas de salud registradas</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Nota</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historia.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>{h.fecha}</TableCell>
                    <TableCell>{h.nota}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};