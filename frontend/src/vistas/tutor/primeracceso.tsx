import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, TextField, Button, Alert } from "@mui/material";

//* pantalla donde la familia crea su contraseña la primera vez que entra
export const PrimerAcceso = () => {
  //^ lo que escribe la persona (la clave ya viene llena si llegó desde el login)
  const [clave, setClave] = useState(sessionStorage.getItem("clavePrimerAcceso") ?? "");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
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

  return (
    <Card sx={{ maxWidth: 420, margin: "80px auto" }}>
      <CardContent>
        <Typography variant="h1">Crea tu contraseña</Typography>
        <TextField label="Clave de acceso" value={clave} onChange={(e) => setClave(e.target.value)} fullWidth margin="normal" />
        <TextField label="Contraseña nueva" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          helperText="Mínimo 8 caracteres, con mayúscula, minúscula, número y carácter especial." fullWidth margin="normal" />
        {mensaje && <Alert severity="error">{mensaje}</Alert>}
        <Button variant="contained" onClick={guardar} fullWidth sx={{ mt: 2 }}>Guardar contraseña</Button>
      </CardContent>
    </Card>
  );
};