/*
? Paleta de colores de la aplicación
- Se establece la paleta de colores que se usará en toda la aplicación para evitar escribir
hexadecimales cada vez.
! Los colores es asignaron de acuerdo a Guía de Identidad Gráfica V1.24 del Gobierno de México
! 2024-2030 (https://www.gob.mx/cms/uploads/attachment/file/993331/Gu_a_de_identidad_gr_fica_P.1-25.pdf)
! ya que no encontramos un manual de imagen único del socio formador.
- Igual se asignaron los colores para la accesibilidad, se asignaron a parecer del equipo.
*/
import { defaultTheme, RaThemeOptions } from "react-admin";

export const colores = {
    //* colores de la Guía
    guinda: "#611232",
    guindaClaro: "#9b2247",
    verde: "#1e5b4f",
    verdeOscuro: "#002f2a",
    dorado: "#a57f2c",
    doradoClaro: "#e6d194",
    negro: "#161a1d",
    gris: "#98989A",
    grisOscuro: "#4D4D4D",
    //* colores de apoyo para accesibilidad
    foco: "#0B57D0", // anillo de foco visible al navegar con teclado
    error: "#B00020",
    exito: "#1B6E3C",
    fondoClaro: "#f0f0ff",
    fondoOscuro: "#a2a5ad",
    borde: "#d5dbd8",
};

//& Paleta tomando los colores de arriba, para facil cambio si es necesario
export const paleta = {
  primario: colores.guinda, // botones principales, enlaces y campo activo
  secundario: colores.verde, // barra superior
  error: colores.error,
  exito: colores.exito,
  fondo: colores.fondoClaro, // fondo de la página
  superficie: "#ffffff", // tarjetas, tablas y formularios
  texto: colores.negro,
  textoSecundario: colores.grisOscuro, // textos de ayuda
};

export const tema: RaThemeOptions = {
  ...defaultTheme,
  palette: {
    mode: "light",
    primary: { main: paleta.primario, contrastText: "#fff" },
    secondary: { main: paleta.secundario, contrastText: "#fff" },
    error: { main: paleta.error },
    success: { main: paleta.exito },
    background: { default: paleta.fondo, paper: paleta.superficie },
    text: { primary: paleta.texto, secondary: paleta.textoSecundario },
  },
  sidebar: { width: 280, closedWidth: 56 },
  typography: {
    // Mínimo 16px para texto normal (legibilidad).
    fontSize: 16,
    htmlFontSize: 16,
    h1: { fontSize: "1.9rem", fontWeight: 700, color: colores.guinda },
    h2: { fontSize: "1.25rem", fontWeight: 700, color: colores.guinda },
    button: { textTransform: "none", fontWeight: 600, fontSize: "1rem" },
  },
  components: {
    ...defaultTheme.components,
    MuiCssBaseline: { styleOverrides: { "*:focus-visible": { outline: `3px solid ${colores.foco}`, outlineOffset: "2px" } } },
  },

}
