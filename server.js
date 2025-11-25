const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Quote = require("./model");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use(express.json());

// 🛠️ SOLUCIÓN: Usar la variable MONGO_URL que Railway inyecta
const dbUrl = process.env.MONGO_URL;
console.log(`🔎 URL de Conexión Intentada: ${dbUrl}`); // Para diagnóstico en Railway

mongoose
  .connect(dbUrl, {
    // Opciones para estabilidad en contenedores y reducir timeout a 5s
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    family: 4,
  })
  .then(() => console.log("✅ Conexión estable con MongoDB"))
  .catch((err) => {
    console.error("❌ Fallo en la conexión a la BD:", err.message);
  });

app.get("/api/quote", async (req, res) => {
  try {
    const count = await Quote.countDocuments();
    if (count === 0) {
      return res.json({ text: "No hay citas disponibles.", author: "Sistema" });
    }
    const random = Math.floor(Math.random() * count);
    const quote = await Quote.findOne().skip(random);
    res.json(quote);
  } catch (error) {
    console.error("Error al obtener cita dinámica:", error);
    res.status(500).json({ error: "Fallo al obtener la cita del servidor." });
  }
});

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.render("index", { quote: null });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
