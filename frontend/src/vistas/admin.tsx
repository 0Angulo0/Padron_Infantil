import { useState } from "react";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { useGetList } from "react-admin";
import {
  Card, CardContent, Typography, TextField, MenuItem, Button, Alert,
  Table, TableHead, TableBody, TableRow, TableCell,
} from "@mui/material";
import { colores } from "../theme";

const ejemplo = [
  { id: 1, nombre: "EBDI 35 Coyoacán", region: "Sur", estado: "Ciudad de México", bajoPeso: 3, adecuado: 33, sobrepeso: 4, obesidad: 2 },
  { id: 2, nombre: "EBDI 4 Cuernavaca", region: "Sur", estado: "Morelos", bajoPeso: 2, adecuado: 24, sobrepeso: 3, obesidad: 1 },
  { id: 3, nombre: "EBDI 8 Monterrey", region: "Norte", estado: "Nuevo León", bajoPeso: 5, adecuado: 22, sobrepeso: 4, obesidad: 2 },
  { id: 4, nombre: "EBDI 7 Veracruz", region: "Este", estado: "Veracruz", bajoPeso: 6, adecuado: 28, sobrepeso: 5, obesidad: 3 },
  { id: 5, nombre: "EBDI 3 Guadalajara", region: "Oeste", estado: "Jalisco", bajoPeso: 4, adecuado: 30, sobrepeso: 3, obesidad: 1 },
];

const infantesEjemplo = [
  { id: 1, ebdiId: 1, matricula: "PI-02481", nombre: "Sofía Martínez López", estadoNutricio: "Peso adecuado" },
  { id: 2, ebdiId: 1, matricula: "PI-02482", nombre: "Mateo Ruiz Cano", estadoNutricio: "Bajo peso" },
  { id: 3, ebdiId: 2, matricula: "PI-02483", nombre: "Valeria Soto Paz", estadoNutricio: "Sobrepeso" },
];

const regiones = ["Norte", "Sur", "Este", "Oeste"];

const sumar = (lista: any[], campo: string) => {
  let n = 0;
  lista.forEach((e) => {
    n = n + e[campo];
  });
  return n;
};

export const Panel = () => {
  const [region, setRegion] = useState("Todas");
  const [estado, setEstado] = useState("Todos");
  const [ebdiId, setEbdiId] = useState("Todas");
  const [nivel, setNivel] = useState("region");
  const [desde, setDesde] = useState("2026-09-01");
  const [hasta, setHasta] = useState("2026-10-21");

  const { data } = useGetList("ebdis", {
    pagination: { page: 1, perPage: 100 },
    filter: { desde: desde, hasta: hasta },
  });
  const { data: dataInfantes } = useGetList("infantes", {
    pagination: { page: 1, perPage: 100 },
    filter: ebdiId === "Todas" ? {} : { ebdiId: ebdiId },
  });

  const ebdis = data && data.length > 0 ? data : ejemplo;
  const infantesTodos = dataInfantes && dataInfantes.length > 0 ? dataInfantes : infantesEjemplo;
  const infantes = infantesTodos.filter((i) => String(i.ebdiId) === ebdiId);

  const porRegion = region === "Todas" ? ebdis : ebdis.filter((e) => e.region === region);
  const estados = porRegion.map((e) => e.estado).filter((s, n, todos) => todos.indexOf(s) === n);
  const porEstado = estado === "Todos" ? porRegion : porRegion.filter((e) => e.estado === estado);
  const lista = ebdiId === "Todas" ? porEstado : porEstado.filter((e) => String(e.id) === ebdiId);

  const bajoPeso = sumar(lista, "bajoPeso");
  const adecuado = sumar(lista, "adecuado");
  const sobrepeso = sumar(lista, "sobrepeso");
  const obesidad = sumar(lista, "obesidad");
  const total = bajoPeso + adecuado + sobrepeso + obesidad;

  const porcentaje = (n: number) => (total === 0 ? 0 : Math.round((n * 100) / total));

  const grupos: string[] = [];
  ebdis.forEach((e: any) => {
    if (!grupos.includes(e[nivel])) {
      grupos.push(e[nivel]);
    }
  });

  const nombreNivel = nivel === "region" ? "Región" : nivel === "estado" ? "Estado" : "EBDI";

  return (
    <div>
      <Typography variant="h1">Panel del administrador</Typography>

      <Typography variant="h2">Consulta general</Typography>

      <TextField select label="Región" value={region} onChange={(e) => { setRegion(e.target.value); setEstado("Todos"); setEbdiId("Todas"); }}>
        <MenuItem value="Todas">Todas</MenuItem>
        {regiones.map((r) => (
          <MenuItem key={r} value={r}>{r}</MenuItem>
        ))}
      </TextField>

      <TextField select label="Estado" value={estado} onChange={(e) => { setEstado(e.target.value); setEbdiId("Todas"); }}>
        <MenuItem value="Todos">Todos</MenuItem>
        {estados.map((s) => (
          <MenuItem key={s} value={s}>{s}</MenuItem>
        ))}
      </TextField>

      <TextField select label="EBDI" value={ebdiId} onChange={(e) => setEbdiId(e.target.value)}>
        <MenuItem value="Todas">Todas</MenuItem>
        {porEstado.map((e) => (
          <MenuItem key={e.id} value={String(e.id)}>{e.nombre}</MenuItem>
        ))}
      </TextField>

      <Card>
        <CardContent>
          {lista.length === 0 ? (
            <Alert severity="info" role="status">No hay EBDI con esos filtros</Alert>
          ) : (
            <div>
              <Typography>EBDI: {lista.length}</Typography>
              <Typography>Infantes con medición: {total}</Typography>
              <Typography>
                Bajo peso: {porcentaje(bajoPeso)}% · Peso adecuado: {porcentaje(adecuado)}% · Sobrepeso: {porcentaje(sobrepeso)}% · Obesidad: {porcentaje(obesidad)}%
              </Typography>
              <div style={{ height: 300 }}>
                <Bar
                  role="img"
                  aria-label={`Porcentaje de infantes por estado nutricio. Bajo peso ${porcentaje(bajoPeso)}%, peso adecuado ${porcentaje(adecuado)}%, sobrepeso ${porcentaje(sobrepeso)}%, obesidad ${porcentaje(obesidad)}%.`}
                  data={{
                    labels: ["Bajo peso", "Peso adecuado", "Sobrepeso", "Obesidad"],
                    datasets: [
                      {
                        label: "Infantes (%)",
                        data: [porcentaje(bajoPeso), porcentaje(adecuado), porcentaje(sobrepeso), porcentaje(obesidad)],
                        backgroundColor: colores.guinda,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      x: { title: { display: true, text: "Estado nutricio" } },
                      y: { min: 0, max: 100, title: { display: true, text: "Infantes (%)" } },
                    },
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {ebdiId !== "Todas" && (
        <Card>
          <CardContent>
            <Typography variant="h2">Infantes de la EBDI</Typography>
            {infantes.length === 0 ? (
              <Typography>Esta EBDI no tiene infantes registrados</Typography>
            ) : (
              <Table aria-label="Infantes de la EBDI">
                <TableHead>
                  <TableRow>
                    <TableCell>Matrícula</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Estado nutricio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {infantes.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell>{i.matricula}</TableCell>
                      <TableCell>{i.nombre}</TableCell>
                      <TableCell>{i.estadoNutricio}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="h2">Reporte general</Typography>
          <TextField select label="Nivel" value={nivel} onChange={(e) => setNivel(e.target.value)}>
            <MenuItem value="region">Región</MenuItem>
            <MenuItem value="estado">Estado</MenuItem>
            <MenuItem value="nombre">EBDI</MenuItem>
          </TextField>
          <TextField label="Desde" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField label="Hasta" type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} InputLabelProps={{ shrink: true }} />
          <Button variant="outlined" onClick={() => window.print()}>Imprimir o guardar reporte</Button>
          <Typography>Periodo: del {desde} al {hasta}</Typography>
          <Table aria-label={`Reporte por ${nombreNivel.toLowerCase()}`}>
            <TableHead>
              <TableRow>
                <TableCell>{nombreNivel}</TableCell>
                <TableCell>Infantes</TableCell>
                <TableCell>Bajo peso</TableCell>
                <TableCell>Peso adecuado</TableCell>
                <TableCell>Sobrepeso</TableCell>
                <TableCell>Obesidad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grupos.map((g) => {
                const delGrupo = ebdis.filter((e: any) => e[nivel] === g);
                const b = sumar(delGrupo, "bajoPeso");
                const a = sumar(delGrupo, "adecuado");
                const s = sumar(delGrupo, "sobrepeso");
                const o = sumar(delGrupo, "obesidad");
                const t = b + a + s + o;
                const p = (n: number) => (t === 0 ? 0 : Math.round((n * 100) / t));
                return (
                  <TableRow key={g}>
                    <TableCell>{g}</TableCell>
                    <TableCell>{t}</TableCell>
                    <TableCell>{p(b)}%</TableCell>
                    <TableCell>{p(a)}%</TableCell>
                    <TableCell>{p(s)}%</TableCell>
                    <TableCell>{p(o)}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};