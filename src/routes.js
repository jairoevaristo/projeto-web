const { Router } = require("express");
const multer = require("multer");

const UserRespository = require("./respositories/UserRepository");
const multerConfig = require("./libs/multer");

const userRespository = new UserRespository();
const routes = Router();

// Rotas de renderização das telas

routes.get("/", (req, res) => {
  return res.render("loja-view");
});

routes.get("/signin", (req, res) => {
  return res.render("login");
});

routes.get("/signup", (req, res) => {
  return res.render("signup");
});

// Rotas de ação

routes.post(
  "/signup",
  multer(multerConfig).single("avatar"),
  async (req, res) => {
    const { nome, email, data_nascimento, telefone, genero, senha } = req.body;
    const avatar = req.file;

    const user = await userRespository.create({
      nome,
      email,
      data_nascimento,
      telefone,
      genero,
      avatar,
      senha,
    });
    console.log(user);
    return res.json(user);
  }
);

routes.post("/signin", async (req, res) => {
  const { email, senha } = req.body;

  const user = await userRespository.login(email, senha);

  if (user) {
    req.session.user = user;
    res.redirect("/loja");
  }
});

routes.use((req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  next();
});

routes.get("/loja", (req, res) => {
  return res.render("loja");
});

module.exports = routes;
