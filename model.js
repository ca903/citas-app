// model.js
const mongoose = require("mongoose");

// Esquema simple para una cita
const QuoteSchema = new mongoose.Schema({
  // El texto de la cita es obligatorio
  text: { type: String, required: true },
  // El autor de la cita es obligatorio
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Quote = mongoose.model("Quote", QuoteSchema);
module.exports = Quote;
