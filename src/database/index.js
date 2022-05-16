const mongoose = require("mongoose");
const Admin = require("../entities/Admin");

mongoose
  .connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`
  )
  .then(() => console.log("Banco de dados conectado com sucesso!"))
  .catch((err) =>
    console.log("Erro ao se conectar ao banco de dados >>> " + err.message)
  );

const seedData = [
  {
    nome: "jairo",
    email: "jairo@gmail.com",
    telefone: "7895748544",
    login: "admin.jairo",
    senha: "$2a$08$NbmFrrChaAvAgz.Wo4xnweB7ZFGhpY1ivt.B7qVNIjYg5s3.DE0aO",
    status: "ACTIVE",
  },
];

const seedDB = async () => {
  await Admin.deleteMany({});
  await Admin.insertMany(seedData);
};

seedDB().then(() => {
  console.log("insert seed Admin");
});

mongoose.Promise = global.Promise;
