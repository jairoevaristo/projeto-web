const { Router } = require("express");

const routes = Router();

routes.get("/signin", (req, res) => {
  return res.render("login");
});

module.exports = routes;
