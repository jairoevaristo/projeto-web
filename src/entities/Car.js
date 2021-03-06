const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  nome: String,
  marca: String,
  preco_diaria: String,
  valor: String,
  status: {
    type: String,
    enum: ["DISPONÍVEL", "INDISPONÍVEL"],
    default: "DISPONÍVEL",
  },
  data_aluguel: Date,
  cor: String,
  foto: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Car", carSchema);
