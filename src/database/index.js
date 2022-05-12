const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`
  )
  .then(() => console.log("Banco de dados conectado com sucesso!"))
  .catch((err) =>
    console.log("Erro ao se conectar ao banco de dados >>> " + err.message)
  );

mongoose.Promise = global.Promise;
