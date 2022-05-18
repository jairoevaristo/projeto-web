const { Router } = require("express");
const multer = require("multer");

const multerConfig = require("./libs/multer");

const UserRespository = require("./respositories/UserRepository");
const CarRepository = require("./respositories/CarRepository");
const AluguelRepository = require("./respositories/AluguelRepository");

const userRespository = new UserRespository();
const carRepository = new CarRepository();
const aluguelRepository = new AluguelRepository();

const routes = Router();

// Rotas de renderização das telas

routes.get("/", async (req, res) => {
  const cars = await carRepository.findAll();
  return res.render("loja-view", { cars });
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

routes.get("/loja", async (req, res) => {
  const { _id } = req.session.user;
  const { avatar, nome } = await userRespository.findUserById(_id);
  const cars = await carRepository.findAllCarDisponiveis();

  console.log({ cars });

  return res.render("auth/loja", { avatar, nome, cars });
});

routes.get("/loja/alugar/:id", async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.user;

  const { avatar, nome } = await userRespository.findUserById(_id);
  const car = await carRepository.findCarById(id);
  const aluguelCar = await aluguelRepository.findAllByIdCar(id);

  const filterStatus = aluguelCar.filter(
    (item) => item.status === "Confirmado"
  );

  console.log({ aluguelCar });
  console.log({ filterStatus });

  return res.render("auth/aluguar-car", { avatar, nome, car, filterStatus });
});

routes.get("/loja/conta", async (req, res) => {
  const { _id } = req.session.user;
  const { avatar, nome } = await userRespository.findUserById(_id);

  const user = await userRespository.findUserById(_id);

  return res.render("auth/conta", { user, avatar, nome });
});

routes.get("/loja/conta-editar", async (req, res) => {
  const { _id } = req.session.user;
  const { avatar, nome } = await userRespository.findUserById(_id);

  const user = await userRespository.findUserById(_id);
  return res.render("auth/conta-edit", { user, avatar, nome });
});

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

routes.get("/loja/conta-senha", async (req, res) => {
  const { _id } = req.session.user;
  const { avatar, nome } = await userRespository.findUserById(_id);

  const messageSuccess = req.flash("senha-success");
  const messageError = req.flash("senha-error");

  return res.render("auth/edit-password", {
    messageError,
    messageSuccess,
    avatar,
    nome,
  });
});

routes.post("/loja/conta-senha", async (req, res) => {
  const { senha_atual, nova_senha } = req.body;
  const { _id } = req.session.user;

  let messageSuccess = "Senha alterado com sucesso";
  let messageError = "Erro ao alterar a senha, tente novamente";

  const user = await userRespository.updatePassword(
    _id,
    senha_atual,
    nova_senha
  );

  if (user) {
    req.flash("senha-success", messageSuccess);
    return res.redirect("/loja/conta-senha");
  }

  req.flash("senha-error", messageError);
  res.redirect("/loja/conta-senha");
});

routes.post("/loja/alugar", async (req, res) => {
  const { inicio_aluguel, fim_aluguel, valor_final, pagamento, id_car } =
    req.body;
  const { _id } = req.session.user;

  let [removeDecimal] = valor_final.split(",");
  let [_, value] = removeDecimal.split("R$ ");

  const aluguel = await aluguelRepository.create({
    car: id_car,
    data_fim: fim_aluguel,
    data_inicio: inicio_aluguel,
    pagamento,
    user: _id,
    valor_final: Number(value),
  });

  if (aluguel) {
    // console.log(aluguel);
    return res.redirect("/loja");
  }
});

routes.get("/loja/aluguel", async (req, res) => {
  const { _id } = req.session.user;
  const { avatar, nome } = await userRespository.findUserById(_id);

  const alugueis = await aluguelRepository.findAllById(_id);

  res.render("auth/meus-alugueis", { avatar, nome, alugueis });
});

module.exports = routes;
