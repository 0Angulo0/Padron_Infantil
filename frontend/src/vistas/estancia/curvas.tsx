import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { Show, TopToolbar, CreateButton, useRecordContext, useGetList, useGetOne, usePermissions } from "react-admin";
import { Card, CardContent, Typography, Alert, Table, TableHead, TableBody, TableRow, TableCell, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { edadTexto } from "./lista";
import { colores } from "../../theme";
import cdc from "../../datos/cdc.json";

//* tipos de datos
type Punto = { x: number; y: number };
type Fila = { x: number; p3: number; p50: number; p97: number };

//* redondea a un decimal
function unDecimal(numero: number) {
  return Math.round(numero * 10) / 10;
}

//* edad en meses entre dos fechas (los CDC usan un mes promedio de 30.4375 días)
function mesesEntre(desde: string, hasta: string) {
  const milisegundos = new Date(hasta).getTime() - new Date(desde).getTime();
  const dias = milisegundos / (1000 * 60 * 60 * 24);
  return dias / 30.4375;
}

//* valor de un percentil en un punto x que no viene exacto en la tabla (interpolacion)
function percentilEn(tabla: Fila[], x: number, percentil: "p3" | "p50" | "p97") {
  for (let i = 0; i < tabla.length - 1; i++) {
    const antes = tabla[i];
    const despues = tabla[i + 1];
    if (x >= antes.x && x <= despues.x) {
      const avance = (x - antes.x) / (despues.x - antes.x); //(0 = justo ahí, 1 = en "despues")
      return antes[percentil] + avance * (despues[percentil] - antes[percentil]);
    }
  }
  return tabla[tabla.length - 1][percentil]; // si se pasa del final, se usa la última fila
}

//* IMC = peso (kg) / talla (m) al cuadrado, con un decimal
// TODO: pasarlo a back por seguridad
function calcularImc(peso: number, tallaCm: number) {
  const tallaMetros = tallaCm / 100;
  return unDecimal(peso / (tallaMetros * tallaMetros));
}

//* tabla de referencia de IMC para la edad, armada con las dos tablas CDC que sí tenemos
function tablaImc(tallaEdad: Fila[], pesoTalla: Fila[]) {
  const tallaMinima = pesoTalla[0].x;
  const tallaMaxima = pesoTalla[pesoTalla.length - 1].x;
  const tabla: Fila[] = [];
  for (let i = 0; i < tallaEdad.length; i++) {
    const fila = tallaEdad[i];
    if (fila.p3 >= tallaMinima && fila.p97 <= tallaMaxima) {
      tabla.push({
        x: fila.x,
        p3: calcularImc(percentilEn(pesoTalla, fila.p3, "p3"), fila.p3),
        p50: calcularImc(percentilEn(pesoTalla, fila.p50, "p50"), fila.p50),
        p97: calcularImc(percentilEn(pesoTalla, fila.p97, "p97"), fila.p97),
      });
    }
  }
  return tabla;
}

//* estado nutricional con la medición más reciente (HU-10/18)
function estadoNutricional(lista: any[], fnac: string, sexo: "1" | "2") {
  if (lista.length == 0) return "Sin mediciones";
  const ultima = lista[lista.length - 1]; // la más reciente

  // primero: IMC para la edad
  let tabla = tablaImc(cdc.tallaEdad[sexo], cdc.pesoTalla[sexo]);
  let x = mesesEntre(fnac, ultima.fecha);
  let y = calcularImc(ultima.peso, ultima.talla);

  // si su edad no está en esa tabla: peso para la talla
  if (x < tabla[0].x || x > tabla[tabla.length - 1].x) {
    tabla = cdc.pesoTalla[sexo];
    x = ultima.talla;
    y = ultima.peso;
  }

  // si tampoco está en esa tabla
  if (x < tabla[0].x || x > tabla[tabla.length - 1].x) return "No se puede evaluar con las tablas disponibles";

  if (y < percentilEn(tabla, x, "p3")) return "Bajo peso";
  if (y > percentilEn(tabla, x, "p97")) return "Riesgo de sobrepeso";
  return "Peso adecuado";
}

//* un elemento de la leyenda: una mini línea igual a la de la gráfica y su texto
//^ guiones: el mismo patrón que borderDash en la gráfica ("10 5" = 10 de línea y 5 de espacio). Vacío = línea continua
function ElementoLeyenda({ color, guiones, grosor, rombo, texto }: { color: string; guiones: string; grosor: number; rombo: boolean; texto: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, marginRight: 20 }}>
      {/* aria-hidden: el dibujo es decorativo, el lector de pantalla ya lee el texto */}
      <svg width="44" height="16" aria-hidden="true">
        <line x1="2" y1="8" x2="42" y2="8" stroke={color} strokeWidth={grosor} strokeDasharray={guiones} />
        {rombo && <polygon points="22,2 28,8 22,14 16,8" fill={color} />}
      </svg>
      {texto}
    </span>
  );
}

//* la leyenda debajo de cada gráfica, con el mismo estilo de línea que tiene cada curva
function Leyenda() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", margin: "8px 0" }}>
      <ElementoLeyenda color={colores.grisOscuro} guiones="10 5" grosor={2} rombo={false} texto="Límite alto (percentil 97)" />
      <ElementoLeyenda color={colores.verde} guiones="" grosor={2} rombo={false} texto="Valor típico (percentil 50)" />
      <ElementoLeyenda color={colores.grisOscuro} guiones="2 4" grosor={2} rombo={false} texto="Límite bajo (percentil 3)" />
      <ElementoLeyenda color={colores.guinda} guiones="" grosor={4} rombo={true} texto="Medidas del infante" />
    </div>
  );
}

type Props = {
  titulo: string;
  ejeX: string;
  ejeY: string;
  referencia: Fila[];
  puntos: Punto[];
  lectura: string;
};

//* una gráfica: las tres curvas de referencia (P3, P50, P97) y las medidas del niño
export function Grafica({ titulo, ejeX, ejeY, referencia, puntos, lectura }: Props) {
  const inicioTabla = referencia[0].x;
  const finTabla = referencia[referencia.length - 1].x;

  //^ las tres curvas de referencia, convertidas a puntos {x, y}
  const curvaP3: Punto[] = [];
  const curvaP50: Punto[] = [];
  const curvaP97: Punto[] = [];
  for (let i = 0; i < referencia.length; i++) {
    curvaP3.push({ x: referencia[i].x, y: referencia[i].p3 });
    curvaP50.push({ x: referencia[i].x, y: referencia[i].p50 });
    curvaP97.push({ x: referencia[i].x, y: referencia[i].p97 });
  }

  //^ las medidas del niño que caben en la tabla, ordenadas de menor a mayor x para que la línea no se cruce
  const medidasNino: Punto[] = [];
  for (let i = 0; i < puntos.length; i++) {
    if (puntos[i].x >= inicioTabla && puntos[i].x <= finTabla) {
      medidasNino.push(puntos[i]);
    }
  }
  medidasNino.sort(function (a, b) { return a.x - b.x; });

  //^ la medición más reciente (las mediciones vienen ordenadas por fecha, la última es la más nueva)
  let ultimo = null;
  if (puntos.length > 0) {
    ultimo = puntos[puntos.length - 1];
  }

  //^ aviso de abajo y descripción para lectores de pantalla (WCAG 1.1.1): lo mismo que se ve, en texto
  let aviso;
  let resumen;
  if (ultimo == null) {
    aviso = <Alert severity="info" role="status">Todavía no hay mediciones</Alert>;
    resumen = "Todavía no hay mediciones.";
  } else if (ultimo.x < inicioTabla || ultimo.x > finTabla) {
    aviso = (
      <Alert severity="info" role="status">
        La tabla de referencia va de {inicioTabla} a {finTabla}, la medición más reciente queda fuera
      </Alert>
    );
    resumen = "La medición más reciente (" + ejeX + ": " + unDecimal(ultimo.x) + ", " + ejeY + ": " + unDecimal(ultimo.y) +
      ") queda fuera de la tabla de referencia, que va de " + inicioTabla + " a " + finTabla + ".";
  } else {
    const minimo = percentilEn(referencia, ultimo.x, "p3");
    const maximo = percentilEn(referencia, ultimo.x, "p97");
    const tipico = percentilEn(referencia, ultimo.x, "p50");
    const dentro = ultimo.y >= minimo && ultimo.y <= maximo; // está entre el percentil 3 y el 97
    if (dentro) {
      aviso = <Alert severity="success" role="status">Dentro del rango esperado</Alert>;
    } else {
      aviso = <Alert severity="warning" role="status">Fuera del rango esperado, conviene revisarlo</Alert>;
    }
    resumen = "Medición más reciente: " + ejeX + " " + unDecimal(ultimo.x) + ", " + ejeY + " " + unDecimal(ultimo.y) + ". " +
      "El valor típico (percentil 50) es " + unDecimal(tipico) + ". " +
      (dentro ? "Está dentro" : "Está fuera") + " del rango esperado, entre el percentil 3 y el 97.";
  }
  const descripcion = "Gráfica de " + titulo + ". " + resumen + " " + puntos.length +
    " mediciones en total; el detalle está en la tabla del historial de mediciones.";

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h2" component="h2">{titulo}</Typography>
        <div style={{ height: 320 }}>
          <Line
            role="img"
            aria-label={descripcion}
            data={{
              datasets: [
                //^ se distinguen por el tipo de línea, no solo por el color (accesibilidad)
                { label: "Límite alto (percentil 97)", data: curvaP97, borderColor: colores.grisOscuro, borderDash: [10, 5], pointRadius: 0 },
                { label: "Valor típico (percentil 50)", data: curvaP50, borderColor: colores.verde, pointRadius: 0 },
                { label: "Límite bajo (percentil 3)", data: curvaP3, borderColor: colores.grisOscuro, borderDash: [2, 4], pointRadius: 0 },
                { label: "Medidas del infante", data: medidasNino, borderColor: colores.guinda, backgroundColor: colores.guinda, borderWidth: 4, pointStyle: "rectRot", pointRadius: 7 },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                //^ la leyenda de Chart.js no dibuja los guiones ni los puntos, por eso usamos la nuestra (Leyenda, abajo)
                legend: { display: false },
              },
              scales: {
                //^ el eje x se queda en el rango de la tabla, así las curvas no se aplastan
                x: { type: "linear", min: inicioTabla, max: finTabla, title: { display: true, text: ejeX } },
                y: { title: { display: true, text: ejeY } },
              },
            }}
          />
        </div>
        <Leyenda />
        <Typography sx={{ mb: 1 }}>{lectura}</Typography>
        {aviso}
      </CardContent>
    </Card>
  );
}

//* la página del niño: sus datos, su historial y sus tres gráficas
function Graficas() {
  const infante = useRecordContext();

  //^ id y ebdi del niño (mientras carga, todavía no hay niño)
  let infanteId;
  let ebdi;
  if (infante) {
    infanteId = infante.id;
    ebdi = infante.ebdi;
  }

  //^ sus mediciones, de la más vieja a la más nueva (por defecto react-admin solo trae 25, por eso 1000)
  const { data: mediciones } = useGetList(
    "mediciones",
    { filter: { infanteId: infanteId }, sort: { field: "fecha", order: "ASC" }, pagination: { page: 1, perPage: 1000 } },
    { enabled: infante != null },
  );
  //^ su estancia, para mostrar la región (UR)
  const { data: estancia } = useGetOne("estancias", { id: ebdi }, { enabled: infante != null });

  if (!infante) {
    return null;
  }

  let lista: any[] = [];
  if (mediciones) {
    lista = mediciones;
  }

  //^ las tablas CDC usan "1" = niño y "2" = niña; en nuestros datos genero es "H" hombre y "M" mujer
  let sexo: "1" | "2" = "1";
  if (infante.genero == "M") {
    sexo = "2";
  }

  const estado = estadoNutricional(lista, infante.fnac, sexo);

  //^ textos de los datos del niño
  let region = "—";
  if (estancia && estancia.region) {
    region = estancia.region;
  }
  let tallaBlanco = "—";
  if (infante.tallaBlancoFamiliar != null) {
    tallaBlanco = infante.tallaBlancoFamiliar + " cm";
    if (infante.tallaMama == null || infante.tallaPapa == null) {
      tallaBlanco = tallaBlanco + " (calculada con la talla promedio en México porque falta la de la mamá o el papá)";
    }
  }

  //^ puntos de cada gráfica y filas del historial (el historial va de la más nueva a la más vieja)
  const puntosPesoTalla: Punto[] = [];
  const puntosTallaEdad: Punto[] = [];
  const puntosImc: Punto[] = [];
  const filasHistorial = [];
  for (let i = 0; i < lista.length; i++) {
    const m = lista[i];
    const edad = mesesEntre(infante.fnac, m.fecha);
    let imc: number | string = "—";
    if (m.peso != null && m.talla != null) {
      imc = calcularImc(m.peso, m.talla);
      puntosImc.push({ x: edad, y: imc });
    }
    puntosPesoTalla.push({ x: m.talla, y: m.peso });
    puntosTallaEdad.push({ x: edad, y: m.talla });

    let perimetro = "—";
    if (m.perimetroCefalico != null) {
      perimetro = m.perimetroCefalico;
    }
    const fila = (
      <TableRow key={m.id}>
        <TableCell>{new Date(m.fecha).toLocaleDateString("es-MX", { timeZone: "UTC" })}</TableCell>
        <TableCell>{Math.floor(edad / 12)} a {Math.floor(edad % 12)} m</TableCell>
        <TableCell>{m.peso}</TableCell>
        <TableCell>{m.talla}</TableCell>
        <TableCell>{perimetro}</TableCell>
        <TableCell>{imc}</TableCell>
      </TableRow>
    );
    filasHistorial.unshift(fila); // unshift lo pone al principio, así la más nueva queda arriba
  }

  //^ el historial: un aviso si no hay mediciones, o la tabla
  let historial;
  if (lista.length == 0) {
    historial = <Alert severity="info" role="status">Todavía no hay mediciones</Alert>;
  } else {
    historial = (
      <Table size="small" aria-label="Historial de mediciones">
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Edad</TableCell>
            <TableCell>Peso (kg)</TableCell>
            <TableCell>Talla (cm)</TableCell>
            <TableCell>Perímetro cefálico (cm)</TableCell>
            <TableCell>Índice de masa corporal (kg/m²)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{filasHistorial}</TableBody>
      </Table>
    );
  }

  return (
    <div>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h2">Datos del infante</Typography>
          <Typography>Matrícula: {infante.matricula} |  EBDI: {infante.ebdi} | Región: {region}</Typography>
          <Typography>Sexo: {infante.genero == "M" ? "Mujer" : "Hombre"} | CURP: {infante.curp || "—"}</Typography>
          <Typography>
            Nacimiento: {new Date(infante.fnac).toLocaleDateString("es-MX", { timeZone: "UTC" })}  | Edad: {edadTexto(infante.fnac)}
          </Typography>
          <Typography>Estatus: {infante.activo == 1 ? "Inscrito" : "Ya no está inscrito"}</Typography>
          <Typography>Talla blanco familiar: {tallaBlanco}</Typography>
          <Alert severity="info" role="status" sx={{ mt: 1 }}>Estado nutricional: {estado}</Alert>
        </CardContent>
      </Card>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h2">Historial de mediciones</Typography>
          {historial}
        </CardContent>
      </Card>
      <Grafica
        titulo="Peso para la talla"
        ejeX="Talla (cm)"
        ejeY="Peso (kg)"
        referencia={cdc.pesoTalla[sexo]}
        puntos={puntosPesoTalla}
        lectura="Muestra si el peso es adecuado para la estatura (CDC, de 77 a 121.5 cm)."
      />
      <Grafica
        titulo="Talla para la edad"
        ejeX="Edad (meses)"
        ejeY="Talla (cm)"
        referencia={cdc.tallaEdad[sexo]}
        puntos={puntosTallaEdad}
        lectura="Muestra si la talla es la esperada para su edad (CDC, de 0 a 36 meses)."
      />
      <Grafica
        titulo="Índice de masa corporal (IMC) para la edad"
        ejeX="Edad (meses)"
        ejeY="IMC (kg/m²)"
        referencia={tablaImc(cdc.tallaEdad[sexo], cdc.pesoTalla[sexo])}
        puntos={puntosImc}
        lectura="Muestra si el peso es proporcional a la estatura para su edad. Las curvas de referencia se calcularon con las tablas CDC de talla para la edad y peso para la talla (aproximación, desde los 19.5 meses en niños y 21.5 en niñas)."
      />
    </div>
  );
}

//* botón "Tomar medidas": solo el personal de estancia captura
function TomarMedidas() {
  const infante = useRecordContext();
  const { permissions } = usePermissions();
  if (!infante || permissions != "estancia") {
    return null;
  }
  return (
    <CreateButton
      resource="mediciones"
      label="Tomar medidas"
      state={{ record: { infanteId: infante.id } }} // así el formulario ya trae al niño escogido
    />
  );
}

//* botón al formulario de mover de estancia o dar de baja (estancia y admin, solo si sigue inscrito)
function MoverOBaja() {
  const infante = useRecordContext();
  const { permissions } = usePermissions();
  if (!infante || infante.activo != 1) {
    return null;
  }
  if (permissions != "estancia" && permissions != "admin") {
    return null;
  }
  return (
    <Button component={Link} to={"/infantes/" + infante.id + "/movimiento"} size="small">
      Mover o dar de baja
    </Button>
  );
}

//* la pantalla que se abre al dar clic en un niño
export function InfanteCurvas() {
  return (
    <Show title="Curvas de crecimiento" actions={<TopToolbar><TomarMedidas /><MoverOBaja /></TopToolbar>}>
      <Graficas />
    </Show>
  );
}