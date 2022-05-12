const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nome: String,
  email: {
    type: String,
    unique: true,
  },
  avatar: String,
  data_nascimento: Date,
  telefone: String,
  genero: String,
  senha: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("User", userSchema);
