const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  nome: String,
  email: {
    type: String,
    unique: true,
  },
  telefone: String,
  login: {
    type: String,
    unique: true,
  },
  senha: String,
  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE",
  },
});

module.exports = mongoose.model("admin", adminSchema, "Admin");
