const { Router } = require("express");

const routes = Router();

routes.get("/", (req, res) => {
  return res.render("loja-view");
});

routes.get("/signin", (req, res) => {
  return res.render("login");
});

routes.get("/signup", (req, res) => {
  return res.render("signup");
});

module.exports = routes;
