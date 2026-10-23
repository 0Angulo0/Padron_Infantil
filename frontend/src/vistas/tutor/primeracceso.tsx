import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, TextField, Button, Alert, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

//* pantalla donde la familia crea su contraseña la primera vez que entra
export const PrimerAcceso = () => {
  //^ lo que escribe la persona (la clave ya viene llena si llegó desde el login)
  const [clave, setClave] = useState(sessionStorage.getItem("clavePrimerAcceso") ?? "");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [verPassword, setVerPassword] = useState(false); // true = se ve la contraseña, false = puntitos
  const navigate = useNavigate(); // para mandarlo al login al terminar

  //^ al dar clic en el botón se manda la clave y la contraseña al backend
  const guardar = async () => {
    const res = await fetch(import.meta.env.VITE_JSON_SERVER_URL + "/primer-acceso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claveAcceso: clave, password: password }),
    });

    if (res.status == 201) { // creado: ya tiene contraseña, que inicie sesión
      sessionStorage.removeItem("clavePrimerAcceso");
      navigate("/login");
    } else if (res.status == 400) { // la contraseña no cumple las reglas, el backend dice cuál falta
      const error = await res.json();
      setMensaje(error.message);
    } else { // 403: la clave no existe o ya tenía contraseña
      setMensaje("La clave no existe o ya tiene contraseña.");
    }
  };

  //^ regresa al login y se olvida la clave guardada
  const volver = () => {
    sessionStorage.removeItem("clavePrimerAcceso");
    navigate("/login");
  };

  return (
    <Card sx={{ maxWidth: 420, margin: "80px auto" }}>
      <CardContent>
        <Typography variant="h1">Crea tu contraseña</Typography>
        <TextField label="Clave de acceso" value={clave} onChange={(e) => setClave(e.target.value)} fullWidth margin="normal" />
        <TextField label="Contraseña nueva" type={verPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
          fullWidth margin="normal"
          slotProps={{
            htmlInput: { "aria-describedby": "reglas" },
            //^ el ojito para ver y ocultar
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setVerPassword(!verPassword)} aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                    {verPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        /> {/* el lector de pantalla lee las reglas al entrar al campo */}
        <Alert id="reglas" severity="info" sx={{ mb: 2 }}>
          Mínimo 8 caracteres, con mayúscula, minúscula, número y carácter especial.
        </Alert>
        {mensaje && <Alert severity="error">{mensaje}</Alert>}
        <Button variant="contained" onClick={guardar} fullWidth sx={{ mt: 2 }}>Guardar contraseña</Button>
        <Button variant = "outlined" onClick = {volver} fullWidth sx = {{ mt: 1 }}> Volver al inicio de sesión </Button>
      </CardContent>
    </Card>
  );
};