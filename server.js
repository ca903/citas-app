// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Quote = require("./model"); // Importar el modelo de la cita

// Configuración de variables de entorno (para desarrollo local)
dotenv.config();

const app = express();
// Puerto dinámico para Railway
const PORT = process.env.PORT || 3000;

// Configuración del motor de plantillas EJS
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

// Middleware para servir archivos estáticos (CSS y JS)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// --------------------------------------------------
// CONEXIÓN A LA BASE DE DATOS
// --------------------------------------------------
// CRITERIO: Posee una Base de Datos Funcional
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Conectado"))
  .catch((err) => console.error("❌ Error de conexión DB:", err));

// --------------------------------------------------
// RUTAS DINÁMICAS
// --------------------------------------------------

// Ruta API para obtener una cita aleatoria (Dinámica)
// CRITERIO: Aplicación Web Dinámica
app.get("/api/quote", async (req, res) => {
  try {
    // Lógica para obtener una cita aleatoria
    const count = await Quote.countDocuments();
    if (count === 0) {
      return res.json({ text: "No hay citas disponibles.", author: "Sistema" });
    }
    const random = Math.floor(Math.random() * count);
    const quote = await Quote.findOne().skip(random);
    res.json(quote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fallo al obtener la cita." });
  }
});

// Ruta Principal (Raíz) - Renderiza la interfaz
app.get("/", (req, res) => {
  res.render("index", { quote: null });
});

// --------------------------------------------------
// INICIO DEL SERVIDOR
// --------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
