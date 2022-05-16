const seed = require("mongoose-seed");

const db = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;

seed.connect(db, () => {
  seed.loadModels(["../entities/Admin"]);

  seed.clearModels(["admin"]);
  seed.populateModels(data, (err, done) => {
    if (err) {
      return console.log("seed err >> ", err);
    }

    if (done) {
      return console.log("seed done >> ", done);
    }

    seed.disconnect();
  });
});

const data = [
  {
    model: "admin",
    documents: [
      {
        nome: "jairo",
        email: "jairo@gmail.com",
        telefone: "7895748544",
        login: "admin.jairo",
        senha: "$2a$08$afku4mhGhRBU3LNedyW9KezG.Sf57z4eJQhRovJo3QPkDam3BAgAG",
        status: "ACTIVE",
        created_at: "",
      },
    ],
  },
];
