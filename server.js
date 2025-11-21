// server.js (CÓDIGO OPTIMIZADO PARA RAILWAY Y EJS)
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

// --------------------------------------------------
// 1. CONFIGURACIÓN DEL MOTOR DE VISTAS (EJS) Y MIDDLEWARE
// --------------------------------------------------
app.set("view engine", "ejs");
// Usar process.cwd() para la ruta absoluta y confiable
app.set("views", path.join(process.cwd(), "views"));

// Middleware para procesar JSON (para rutas POST)
app.use(express.json());

// --------------------------------------------------
// 2. CONEXIÓN A LA BASE DE DATOS (DEBE IR ANTES DE LAS RUTAS API)
// --------------------------------------------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Conectado"))
  .catch((err) => console.error("❌ Error de conexión DB:", err));

// --------------------------------------------------
// 3. RUTAS API (LÓGICA DINÁMICA)
// --------------------------------------------------
// Estas deben ir antes de la ruta estática y la ruta raíz
app.get("/api/quote", async (req, res) => {
  try {
    // Consulta simplificada
    const count = await Quote.countDocuments();
    if (count === 0) {
      return res.json({ text: "No hay citas disponibles.", author: "Sistema" });
    }
    const random = Math.floor(Math.random() * count);
    const quote = await Quote.findOne().skip(random);
    res.json(quote);
  } catch (error) {
    console.error("Error al obtener cita dinámica:", error);
    // Devolvemos un error 500 legible para el frontend
    res.status(500).json({ error: "Fallo al obtener la cita del servidor." });
  }
});
