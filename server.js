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

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Conectado"))
  .catch((err) => console.error("❌ Error de conexión DB:", err));

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
