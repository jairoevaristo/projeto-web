const { Router } = require("express");
const multer = require("multer");

const AdminRepository = require("./respositories/AdminRepository");
const CarRepository = require("./respositories/CarRepository");
const multerConfigAdmin = require("./libs/multer.admin");

const routesAdmin = Router();
const adminRepository = new AdminRepository();
const carRepository = new CarRepository();

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

routesAdmin.get("/loja", (req, res) => {
  return res.render("admin/loja");
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

    const foto = `${process.env.DOMAIN_APP}/cars/${avatar.filename.replace(
      " ",
      "-"
    )}`;

    const car = await carRepository.create({
      cor,
      foto,
      marca,
      nome,
      preco_diaria,
      valor: valor_carro,
    });

    console.log(car);
    return res.json(car);
  }
);

module.exports = routesAdmin;
