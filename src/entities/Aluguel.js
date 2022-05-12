const mongoose = require("mongoose");

const aluguelSchema = new mongoose.Schema({
  data_inicio: Date,
  data_fim: Date,
  valor_final: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Aluguel", aluguelSchema);
