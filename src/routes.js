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
  const message = req.flash("login-error");
  return res.render("login", { message });
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
    return res.json(user);
  }
);

routes.post("/signin", async (req, res) => {
  const { email, senha } = req.body;
  let message = "Email ou senha incorretos";

  const user = await userRespository.login(email, senha);

  if (user) {
    req.session.user = user;
    return res.redirect("/loja");
  }

  req.flash("login-error", message);
  res.redirect("/signin");
});

routes.use((req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  next();
});

routes.get("/loja", (req, res) => {
  return res.render("auth/loja");
});

routes.get("/loja/conta", async (req, res) => {
  const { _id } = req.session.user;
  const user = await userRespository.findUserById(_id);

  return res.render("auth/conta", { user });
});

routes.get("/loja/conta-editar", async (req, res) => {
  const { _id } = req.session.user;

  const user = await userRespository.findUserById(_id);
  return res.render("auth/conta-edit", { user });
});

module.exports = routes;

routes.post(
  "/loja/conta-editar",
  multer(multerConfig).single("avatar"),
  async (req, res) => {
    const { nome, email, data_nascimento, telefone, genero } = req.body;
    const avatar = req.file;
    const { _id } = req.session.user;

    const user = await userRespository.updateUserById(_id, {
      nome,
      email,
      data_nascimento,
      telefone,
      genero,
      avatar,
    });

    res.json(user);
  }
);

routes.get("/loja/conta-senha", (req, res) => {
  const messageSuccess = req.flash("senha-success");
  const messageError = req.flash("senha-error");

  return res.render("auth/edit-password", { messageError, messageSuccess });
});

routes.post("/loja/conta-senha", async (req, res) => {
  const { senha_atual, nova_senha } = req.body;
  const { _id } = req.session.user;

  let messageSuccess = "Senha alterado com sucesso";
  let messageError = "Erro ao alterar a senha, tem novamente";

  const user = await userRespository.updatePassword(
    _id,
    senha_atual,
    nova_senha
  );

  if (user) {
    console.log(user);
    req.flash("senha-success", messageSuccess);
    return res.redirect("/loja/conta-senha");
  }

  req.flash("senha-error", messageError);
  res.redirect("/loja/conta-senha");
});

module.exports = routes;