import { useState } from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useGetList } from "react-admin";
import {
  Card, CardContent, Typography, Tabs, Tab, Button, Alert,
  Table, TableHead, TableBody, TableRow, TableCell,
} from "@mui/material";
import { colores } from "../theme";

type Indicador = "peso" | "talla" | "perimetro";

//formato de una medición (así debe llegar de la base de datos)
type Medicion = {
  id: number;
  infanteId: number;
  edad: number; // en años: 1, 1.5, 2, 2.5...
  peso: number; // kg
  talla: number; // cm
  perimetro: number; // cm
};

//edades de la tabla de referencia (en años)
const edades = [1, 1.5, 2, 2.5, 3, 3.5];

//referencia de ejemplo (después van las tablas oficiales)
const referencia = {
  peso: { p3: [10.2, 10.8, 11.4, 12.1, 12.9, 13.6], p50: [12.0, 12.7, 13.6, 14.5, 15.3, 16.0], p97: [14.6, 15.3, 16.0, 16.9, 17.7, 18.3] },
  talla: { p3: [68.9, 74.9, 80.0, 84.5, 88.7, 92.0], p50: [74.0, 80.7, 86.0, 91.0, 95.1, 99.0], p97: [79.2, 86.5, 92.9, 97.5, 102.0, 106.0] },
  perimetro: { p3: [42.2, 43.5, 44.5, 45.2, 45.7, 46.1], p50: [44.9, 46.2, 47.2, 47.8, 48.5, 49.0], p97: [47.5, 48.9, 49.9, 50.5, 51.0, 51.5] },
};

//datos de ejemplo, se usan si el backend no responde
const ejemplo: Medicion[] = [
  { id: 1, infanteId: 1, edad: 1, peso: 10.6, talla: 75.0, perimetro: 45.8 },
  { id: 2, infanteId: 1, edad: 1.5, peso: 12.2, talla: 81.5, perimetro: 47.0 },
  { id: 3, infanteId: 1, edad: 2, peso: 13.1, talla: 86.5, perimetro: 48.0 },
  { id: 4, infanteId: 1, edad: 2.5, peso: 14.4, talla: 91.4, perimetro: 49.2 },
];

export const Curvas = () => {
  const [indicador, setIndicador] = useState<Indicador>("peso");
  const [verTabla, setVerTabla] = useState(false);

  //pide las mediciones al backend (recurso "mediciones")
  const { data } = useGetList<Medicion>("mediciones", {
    filter: { infanteId: 1 },
    sort: { field: "edad", order: "ASC" },
  });
  const mediciones = data && data.length > 0 ? data : ejemplo;

  const ref = referencia[indicador];

  //por cada edad de la tabla busca la medición del infante (si no hay, null)
  const valores = edades.map((edad) => {
    const m = mediciones.find((x) => x.edad === edad);
    return m ? m[indicador] : null;
  });

  //la última medición debe estar entre P3 y P97 de su edad
  const ultima = mediciones[mediciones.length - 1];
  const i = edades.indexOf(ultima.edad);
  const dentro = i === -1 || (ultima[indicador] >= ref.p3[i] && ultima[indicador] <= ref.p97[i]);

  return (
    <div>
      <Typography variant="h1">Curvas de crecimiento</Typography>
      <Typography>Sofía Martínez López · 2 años 7 meses</Typography>

      <Tabs value={indicador} onChange={(e, v) => setIndicador(v)}>
        <Tab value="peso" label="Peso" />
        <Tab value="talla" label="Talla" />
        <Tab value="perimetro" label="Perímetro cefálico" />
      </Tabs>

      <Card>
        <CardContent>
          {verTabla ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Edad</TableCell>
                  <TableCell>Límite bajo</TableCell>
                  <TableCell>Promedio</TableCell>
                  <TableCell>Límite alto</TableCell>
                  <TableCell>Medición del infante</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {edades.map((edad, n) => {
                  const v = valores[n];
                  let estado = "Sin medición";
                  if (v !== null) {
                    if (v < ref.p3[n]) estado = "Por debajo del rango";
                    else if (v > ref.p97[n]) estado = "Por encima del rango";
                    else estado = "Dentro del rango";
                  }
                  return (
                    <TableRow key={edad}>
                      <TableCell>{edad === 1 ? "1 año" : `${edad} años`}</TableCell>
                      <TableCell>{ref.p3[n]}</TableCell>
                      <TableCell>{ref.p50[n]}</TableCell>
                      <TableCell>{ref.p97[n]}</TableCell>
                      <TableCell>{v ?? "—"}</TableCell>
                      <TableCell>{estado}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div style={{ height: 350 }}>
              <Line
                data={{
                  labels: edades,
                  datasets: [
                 { label: "Límite alto", data: ref.p97, borderColor: colores.grisOscuro, borderDash: [10, 5], pointStyle: "rect" },
                 { label: "Promedio", data: ref.p50, borderColor: colores.verde, pointStyle: "circle" },
                 { label: "Límite bajo", data: ref.p3, borderColor: colores.grisOscuro, borderDash: [2, 4], pointStyle: "triangle" },
                 { label: "Infante", data: valores, borderColor: colores.guinda, borderWidth: 4, pointStyle: "rectRot", pointRadius: 7, spanGaps: true },
                ],
                }}
                options={{ maintainAspectRatio: false, plugins: { legend: { labels: { usePointStyle: true } } } }}
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
          <Typography>
            Las líneas grises marcan el rango esperado para su edad: la de arriba es el límite alto,
            la de abajo es el límite bajo, y la verde es el promedio. La línea gruesa es el infante.
          </Typography>
          <Alert severity={dentro ? "success" : "warning"} role="status">
            {dentro ? "Dentro del rango esperado para su edad" : "Fuera del rango esperado para su edad"}
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};