# Padrón Infantil

Aplicación web para llevar el padrón de los infantes de las Estancias para el Bienestar y Desarrollo Infantil (EBDI) del ISSSTE y seguir su crecimiento con las curvas de la CDC (peso para la talla, talla para la edad e IMC para la edad).

## Manuales

- Manual de instalación: [_\[link\]_](https://docs.google.com/document/d/1LzXnPxCnPrN33mT2DEYWTHlzp-zutaZ9rsIf5aO0H9I/edit?usp=sharing)
- Manual de usuario: [_\[link\]_](https://docs.google.com/document/d/1UBZ-aDTwcIrQfKpmEqsvxdbKQSY5qpd4b_auBKlo0j4/edit?usp=sharing)

## ¿Quién la usa?

| Rol | Qué puede hacer |
|---|---|
| Administrador | Ve todo el padrón, corrige datos, da de alta al personal y las estancias |
| Coordinador regional | Consulta las estancias e infantes de su región y descarga reportes |
| Personal de estancia | Registra infantes, captura sus medidas, los cambia de estancia o los da de baja |
| Madre, padre o tutor | Ve los datos y las curvas de crecimiento de su hija o hijo |

## Tecnologías

- **Frontend:** React, react-admin, Material UI y Chart.js (con Vite)
- **Backend:** Node.js con Express, HTTPS y tokens JWT
- **Base de datos:** MongoDB Atlas
- **Contraseñas:** argon2

## Cómo correrlo

Se necesita Node.js y una base de datos en MongoDB Atlas.

### Backend

```bash
cd backend
npm install
```

Crear el archivo `backend/.env`:

```
DB=<cadena de conexión de MongoDB Atlas>
LLAVEJWT=<texto secreto para los tokens>
PORT=3000
```

Generar el certificado para HTTPS:

```bash
openssl req -nodes -new -x509 -keyout server.key -out server.crt
```

Cargar los datos de prueba (opcional, **borra lo que haya en la base**) y prender el servidor:

```bash
npm run semilla
npm start
```

### Frontend

```bash
cd frontend
npm install
```

Abrir el navegador y aceptar el certificado. Después:

```bash
npm run dev
```
### Accesibilidad

- Análisis de accesibilidad de nuestra app: [_\[link\]_](https://docs.google.com/document/d/1tehf1Rb4Iv3OR65pX4j3TyJdHFMzrBfzPlq0zYQkirQ/edit?usp=sharing)
