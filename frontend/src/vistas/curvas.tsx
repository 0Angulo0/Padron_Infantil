import { useState } from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useGetList, useGetOne } from "react-admin";
import {
  Card, CardContent, Typography, Tabs, Tab, Button, Alert,
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

export const Curvas = () => {
  const [indicador, setIndicador] = useState("peso");
  const [verTabla, setVerTabla] = useState(false);

  const { data: dataInfante } = useGetOne<Infante>("infantes", { id: infanteId });
  const { data: dataMediciones } = useGetList<Medicion>("mediciones", {
    filter: { infanteId: infanteId },
    sort: { field: "fecha", order: "ASC" },
  });

  const infante = dataInfante ? dataInfante : infanteEjemplo;
  const mediciones = dataMediciones && dataMediciones.length > 0 ? dataMediciones : medicionesEjemplo;

  const edadDe = (m: Medicion) => calcularEdad(infante.fechaNacimiento, m.fecha);
  const edadActual = calcularEdad(infante.fechaNacimiento, new Date().toISOString());

  const graficas: any = {
    peso: {
      titulo: "Peso para la talla",
      ejeX: "Talla (cm)",
      ejeY: "Peso (kg)",
      referencia: pesoParaTalla,
      valorX: (m: Medicion) => m.talla,
      valorY: (m: Medicion) => m.peso,
      lectura: "Muestra si el peso es adecuado para la estatura. Mientras la línea gruesa se mantenga entre las dos líneas grises, el peso es adecuado para su talla.",
    },
    talla: {
      titulo: "Talla para la edad",
      ejeX: "Edad (años)",
      ejeY: "Talla (cm)",
      referencia: tallaParaEdad,
      valorX: (m: Medicion) => edadDe(m),
      valorY: (m: Medicion) => m.talla,
      lectura: "Muestra si la estatura es la esperada para su edad. La línea gruesa debe subir de forma parecida a la línea verde.",
    },
    imc: {
      titulo: "Índice de masa corporal (IMC)",
      ejeX: "Edad (años)",
      ejeY: "IMC",
      referencia: imcParaEdad,
      valorX: (m: Medicion) => edadDe(m),
      valorY: (m: Medicion) => calcularImc(m),
      lectura: "Relaciona el peso con la estatura según la edad. Si la línea gruesa sale del espacio entre las líneas grises, hay que revisar el caso.",
    },
  };

  const g = graficas[indicador];

  const estadoDe = (m: Medicion) => {
    let cercano = g.referencia[0];
    g.referencia.forEach((r: Punto) => {
      if (Math.abs(r.x - g.valorX(m)) < Math.abs(cercano.x - g.valorX(m))) {
        cercano = r;
      }
    });
    const valor = g.valorY(m);
    if (valor < cercano.bajo) return "Por debajo del rango";
    if (valor > cercano.alto) return "Por encima del rango";
    return "Dentro del rango";
  };

  const ultima = mediciones[mediciones.length - 1];
  const estadoUltima = estadoDe(ultima);

  return (
    <div>
      <Typography variant="h1">Curvas de crecimiento</Typography>
      <Typography>
        {infante.nombre} · Matrícula {infante.matricula} · {edadActual} años
      </Typography>

      <Tabs value={indicador} onChange={(e, v) => setIndicador(v)}>
        <Tab value="peso" label="Peso para la talla" />
        <Tab value="talla" label="Talla para la edad" />
        <Tab value="imc" label="IMC" />
      </Tabs>

      <Card>
        <CardContent>
          <Typography variant="h2">{g.titulo}</Typography>
          {verTabla ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Edad</TableCell>
                  <TableCell>Peso (kg)</TableCell>
                  <TableCell>Talla (cm)</TableCell>
                  <TableCell>IMC</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mediciones.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.fecha}</TableCell>
                    <TableCell>{edadDe(m)} años</TableCell>
                    <TableCell>{m.peso}</TableCell>
                    <TableCell>{m.talla}</TableCell>
                    <TableCell>{calcularImc(m)}</TableCell>
                    <TableCell>{estadoDe(m)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div style={{ height: 350 }}>
              <Line
                data={{
                  datasets: [
                    {
                      label: "Límite alto",
                      data: g.referencia.map((r: Punto) => ({ x: r.x, y: r.alto })),
                      borderColor: colores.grisOscuro,
                      borderDash: [10, 5],
                      pointStyle: "rect",
                    },
                    {
                      label: "Promedio",
                      data: g.referencia.map((r: Punto) => ({ x: r.x, y: r.medio })),
                      borderColor: colores.verde,
                      pointStyle: "circle",
                    },
                    {
                      label: "Límite bajo",
                      data: g.referencia.map((r: Punto) => ({ x: r.x, y: r.bajo })),
                      borderColor: colores.grisOscuro,
                      borderDash: [2, 4],
                      pointStyle: "triangle",
                    },
                    {
                      label: "Infante",
                      data: mediciones.map((m) => ({ x: g.valorX(m), y: g.valorY(m) })),
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
          )}
          <Button variant="outlined" onClick={() => setVerTabla(!verTabla)}>
            {verTabla ? "Ver como gráfica" : "Ver como tabla"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography>{g.lectura}</Typography>
          <Typography>Última medición: {ultima.peso} kg, {ultima.talla} cm, IMC {calcularImc(ultima)}</Typography>
          <Alert severity={estadoUltima === "Dentro del rango" ? "success" : "warning"} role="status">
            {g.titulo}: {estadoUltima.toLowerCase()}
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};