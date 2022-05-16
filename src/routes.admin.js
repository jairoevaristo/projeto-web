const { Router } = require("express");
const multer = require("multer");

const AdminRepository = require("./respositories/AdminRepository");
const multerConfig = require("./libs/multer.admin");

const routesAdmin = Router();
const adminRepository = new AdminRepository();

routesAdmin.get("/signin", (req, res) => {
  const message = req.flash("login-error");
  return res.render("admin/login", { message });
});

routesAdmin.post("/signin", async (req, res) => {
  const { login, senha } = req.body;
  let message = "Email ou senha incorretos";

  const user = await adminRepository.login(login, senha);

  if (user) {
    req.session.admin = admin;
    return res.redirect("/admin/loja");
  }

  req.flash("login-error", message);
  res.redirect("admin/signin");
});

// routesAdmin.use((req, res, next) => {
//   if (!req.session.admin) {
//     return res.redirect("/admin/signin");
//   }

//   // fazer condição para admin com o status ativo ou inativo

//   next();
// });

routesAdmin.get("/loja", (req, res) => {
  return res.render("admin/loja");
});

routesAdmin.get("/usuarios", async (req, res) => {
  const admins = await adminRepository.findAll();

  return res.render("admin/users", { admins });
});

routesAdmin.get("/add-usuario", (req, res) => {
  return res.render("admin/add-user");
});

routesAdmin.get("/add-usuario", (req, res) => {
  const message = req.flash("add-user");
  return res.render("admin/add-user", { message });
});

routesAdmin.post("/add-usuario", async (req, res) => {
  const { nome, email, telefone, login, senha } = req.body;

  const user = await adminRepository.create({
    nome,
    email,
    telefone,
    login,
    senha,
  });

  if (user.message) {
    message = user.message;
    req.flash("add-user", message);
    return res.redirect("/admin/add-usuario");
  }

  return res.redirect("/admin/usuarios");
});

module.exports = routesAdmin;
