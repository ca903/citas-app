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
app.use(express.urlencoded({ extended: true }));

const dbUrl = process.env.MONGO_URL;
console.log(`🔎 URL de Conexión Intentada: ${dbUrl}`);

mongoose
  .connect(dbUrl, {
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

app.get("/admin", async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ date: -1 });
    res.render("admin", { quotes: quotes }); // Renderiza la vista admin.ejs
  } catch (error) {
    console.error("Error al listar citas:", error);
    res.status(500).send("Fallo al listar citas.");
  }
});

app.get("/admin/new", (req, res) => {
  res.render("form", {
    title: "Añadir Nueva Cita",
    quote: { text: "", author: "" },
    action: "/admin/new",
  });
});

app.post("/admin/new", async (req, res) => {
  try {
    const newQuote = new Quote({
      text: req.body.text,
      author: req.body.author,
    });
    await newQuote.save();
    res.redirect("/admin");
  } catch (error) {
    console.error("Error al guardar la cita:", error);
    res.status(500).send("Fallo al guardar la cita.");
  }
});

app.get("/admin/edit/:id", async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).send("Cita no encontrada.");
    // Envía la cita encontrada para precargar el formulario
    res.render("form", {
      title: "Editar Cita",
      quote: quote,
      action: `/admin/edit/${req.params.id}`,
    });
  } catch (error) {
    console.error("Error al obtener cita para editar:", error);
    res.status(500).send("Fallo al obtener la cita.");
  }
});

app.post("/admin/edit/:id", async (req, res) => {
  try {
    await Quote.findByIdAndUpdate(req.params.id, {
      text: req.body.text,
      author: req.body.author,
    });
    res.redirect("/admin");
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    res.status(500).send("Fallo al actualizar la cita.");
  }
});

app.post("/admin/delete/:id", async (req, res) => {
  try {
    await Quote.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
    res.status(500).send("Fallo al eliminar la cita.");
  }
});

// -----------------------------------------------------

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.render("index", { quote: null });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
