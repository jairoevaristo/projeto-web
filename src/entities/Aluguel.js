const mongoose = require("mongoose");

const aluguelSchema = new mongoose.Schema({
  data_inicio: Date,
  data_fim: Date,
  valor_final: Number,
  pagamento: {
    type: String,
    enum: ["Pix", "Cartão", "Boleto"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
  },
  status: {
    type: String,
    enum: ["Aguardando Confirmação", "Confirmado", "Rejeitado"],
    default: "Aguardando Confirmação",
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Aluguel", aluguelSchema);
