const { Router } = require("express");
const multer = require("multer");

const AdminRepository = require("./respositories/AdminRepository");
const CarRepository = require("./respositories/CarRepository");
const multerConfigAdmin = require("./libs/multer.admin");
const AluguelRepository = require("./respositories/AluguelRepository");

const routesAdmin = Router();
const adminRepository = new AdminRepository();
const carRepository = new CarRepository();
const aluguelRepository = new AluguelRepository();

routesAdmin.get("/signin", (req, res) => {
  const message = req.flash("login-error");
  return res.render("admin/login", { message });
});

routesAdmin.post("/signin", async (req, res) => {
  const { login, senha } = req.body;
  let message = "Login ou senha incorretos";

  const admin = await adminRepository.login(login, senha);

  if (admin) {
    req.session.admin = admin;
    return res.redirect("/admin/loja");
  }

  req.flash("login-error", message);
  res.redirect("admin/signin");
});

routesAdmin.use(async (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/signin");
  }

  const { _id } = req.session.admin;
  const isUserActive = await adminRepository.findAdminById(_id);

  if (!isUserActive) {
    return res.redirect("/admin/signin");
  }

  if (isUserActive.status === "INACTIVE") {
    let message = "Este usuário está inativo, tem outro";
    req.flash("login-error", message);
    return res.redirect("/admin/signin");
  }

  next();
});

routesAdmin.get("/loja", async (req, res) => {
  const message = req.flash("remove-car");
  const cars = await carRepository.findAll();
  return res.render("admin/loja", { cars, message });
});

routesAdmin.get("/usuarios", async (req, res) => {
  const admins = await adminRepository.findAll();

  return res.render("admin/users", { admins });
});

routesAdmin.get("/add-usuario", (req, res) => {
  const message = req.flash("add_user");
  return res.render("admin/add-user", { message });
});

routesAdmin.post("/add-usuario", async (req, res) => {
  const { nome, email, telefone, login, senha } = req.body;
  let message = "teste";

  const user = await adminRepository.create({
    nome,
    email,
    telefone,
    login,
    senha,
  });

  if (user.message) {
    message = user.message;
    req.flash("add_user", message);
    return res.redirect("/admin/add-usuario");
  }

  return res.redirect("/admin/usuarios");
});

routesAdmin.post("/editar-usuario", async (req, res) => {
  const { nome, email, telefone, login, senha, status, user_id } = req.body;

  const user = await adminRepository.updateAdminById(user_id, {
    nome,
    email,
    telefone,
    login,
    senha,
    status,
  });

  if (user) {
    return res.redirect("/admin/usuarios");
  }
});

routesAdmin.get("/loja/add-carro", (req, res) => {
  const message = req.flash("add_car");
  return res.render("admin/add-car", { message });
});

routesAdmin.post(
  "/loja/add-carro",
  multer(multerConfigAdmin).single("avatar"),
  async (req, res) => {
    const { nome, marca, preco_diaria, valor_carro, cor } = req.body;
    const avatar = req.file;

    console.log(avatar);

    const car = await carRepository.create({
      cor,
      foto: avatar,
      marca,
      nome,
      preco_diaria,
      valor: valor_carro,
    });

    return res.json(car);
  }
);

routesAdmin.get("/loja/edit-carro/:id", async (req, res) => {
  const { id } = req.params;
  const message = req.flash("edit_car");
  const car = await carRepository.findCarById(id);

  return res.render("admin/edit-car", { message, car });
});

routesAdmin.post(
  "/loja/edit-carro",
  multer(multerConfigAdmin).single("avatar"),
  async (req, res) => {
    const { nome, marca, preco_diaria, valor, cor, id } = req.body;
    const avatar = req.file;

    const car = await carRepository.updateCarById(id, {
      nome,
      marca,
      preco_diaria,
      valor,
      cor,
      avatar,
    });

    if (car) {
      return res.json(car);
    }
  }
);

routesAdmin.get("/usuarios", async (req, res) => {
  const admins = await adminRepository.findAll();

  return res.render("admin/users", { admins });
});

routesAdmin.get("/alugueis", async (req, res) => {
  const alugueis = await aluguelRepository.findAll();

  return res.render("admin/aluguel", { alugueis });
});

routesAdmin.post("/aluguel", async (req, res) => {
  const { status, id, idCar } = req.body;

  const aluguel = await aluguelRepository.updateStatus(id, {
    status,
    id_car: idCar,
  });

  if (aluguel) {
    return res.redirect("/admin/alugueis");
  }
});

routesAdmin.get("/loja/remove-carro/:id", async (req, res) => {
  const { id } = req.params;
  const result = await carRepository.removeCar(id);

  let message = "";

  if (result.message) {
    message = result.message;
    req.flash("remove-car", message);
    return res.redirect("/admin/loja");
  }

  return res.redirect("/admin/loja");
});

module.exports = routesAdmin;
