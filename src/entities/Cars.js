const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  nome: String,
  marca: String,
  preco_diario: Number,
  valor: Number,
  cor: String,
  foto: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Car", carSchema);
