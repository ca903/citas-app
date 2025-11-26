// model.js
const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Quote = mongoose.model("Quote", QuoteSchema, "quotes");

module.exports = Quote;
