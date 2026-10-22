import { useState } from "react";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { useGetList } from "react-admin";
import {
  Card, CardContent, Typography, TextField, MenuItem, Button, Alert,
  Table, TableHead, TableBody, TableRow, TableCell,
} from "@mui/material";
import { colores } from "../theme";

type Ebdi = {
  id: number;
  nombre: string;
  estado: string;
  tipo: string;
  bajoPeso: number;
  adecuado: number;
  sobrepeso: number;
  obesidad: number;
};

const ejemplo: Ebdi[] = [
  { id: 1, nombre: "EBDI 35 Coyoacán", estado: "Ciudad de México", tipo: "Propia", bajoPeso: 3, adecuado: 33, sobrepeso: 4, obesidad: 2 },
  { id: 2, nombre: "EBDI 12 Iztapalapa", estado: "Ciudad de México", tipo: "Contratada", bajoPeso: 9, adecuado: 36, sobrepeso: 7, obesidad: 3 },
  { id: 3, nombre: "EBDI 4 Cuernavaca", estado: "Morelos", tipo: "Propia", bajoPeso: 2, adecuado: 24, sobrepeso: 3, obesidad: 1 },
  { id: 4, nombre: "EBDI 9 Cuautla", estado: "Morelos", tipo: "OSC", bajoPeso: 5, adecuado: 22, sobrepeso: 4, obesidad: 2 },
  { id: 5, nombre: "EBDI 7 Acapulco", estado: "Guerrero", tipo: "Propia", bajoPeso: 6, adecuado: 28, sobrepeso: 5, obesidad: 3 },
];

const porcentaje = (parte: number, total: number) =>
  total === 0 ? 0 : Math.round((parte * 100) / total);

const totalDe = (e: Ebdi) => e.bajoPeso + e.adecuado + e.sobrepeso + e.obesidad;

export const Coordinador = () => {
  const [estado, setEstado] = useState("Todos");
  const [desde, setDesde] = useState("2026-09-01");
  const [hasta, setHasta] = useState("2026-10-21");

  const { data } = useGetList<Ebdi>("ebdis", {
    filter: { desde: desde, hasta: hasta },
  });
  const ebdis = data && data.length > 0 ? data : ejemplo;

  let estados: string[] = [];
  ebdis.forEach((e) => {
    if (!estados.includes(e.estado)) {
      estados.push(e.estado);
    }
  });

  const lista = estado === "Todos" ? ebdis : ebdis.filter((e) => e.estado === estado);

  let bajoPeso = 0;
  let adecuado = 0;
  let sobrepeso = 0;
  let obesidad = 0;
  lista.forEach((e) => {
    bajoPeso = bajoPeso + e.bajoPeso;
    adecuado = adecuado + e.adecuado;
    sobrepeso = sobrepeso + e.sobrepeso;
    obesidad = obesidad + e.obesidad;
  });
  const total = bajoPeso + adecuado + sobrepeso + obesidad;
  const aVigilar = 100 - porcentaje(adecuado, total);

  return (
    <div>
      <Typography variant="h1">Inicio del coordinador</Typography>

      <Card>
        <CardContent>
          <Typography variant="h2">Filtros del reporte</Typography>
          <TextField select label="Estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <MenuItem value="Todos">Todos</MenuItem>
            {estados.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Desde"
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Hasta"
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="outlined" onClick={() => window.print()}>
            Imprimir o guardar reporte
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography>Periodo: del {desde} al {hasta}</Typography>
          <Typography>EBDI: {lista.length}</Typography>
          <Typography>Infantes con medición: {total}</Typography>
        </CardContent>
      </Card>

      <Alert severity={aVigilar <= 25 ? "success" : "warning"} role="status">
        {aVigilar}% de los infantes no tiene un estado nutricio adecuado
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="h2">Infantes por estado nutricio</Typography>
          <div style={{ height: 300 }}>
            <Bar
              data={{
                labels: ["Bajo peso", "Peso adecuado", "Sobrepeso", "Obesidad"],
                datasets: [
                  {
                    label: "Porcentaje de infantes",
                    data: [
                      porcentaje(bajoPeso, total),
                      porcentaje(adecuado, total),
                      porcentaje(sobrepeso, total),
                      porcentaje(obesidad, total),
                    ],
                    backgroundColor: colores.guinda,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: { min: 0, max: 100, title: { display: true, text: "Infantes (%)" } },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h2">Detalle por EBDI</Typography>
          {lista.length === 0 ? (
            <Typography>No hay EBDI en este estado</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>EBDI</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Bajo peso</TableCell>
                  <TableCell>Peso adecuado</TableCell>
                  <TableCell>Sobrepeso</TableCell>
                  <TableCell>Obesidad</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lista.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.nombre}</TableCell>
                    <TableCell>{e.estado}</TableCell>
                    <TableCell>{e.tipo}</TableCell>
                    <TableCell>{porcentaje(e.bajoPeso, totalDe(e))}%</TableCell>
                    <TableCell>{porcentaje(e.adecuado, totalDe(e))}%</TableCell>
                    <TableCell>{porcentaje(e.sobrepeso, totalDe(e))}%</TableCell>
                    <TableCell>{porcentaje(e.obesidad, totalDe(e))}%</TableCell>
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