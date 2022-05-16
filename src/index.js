require("dotenv").config();
require("./database");

const express = require("express");
const cors = require("cors");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const session = require("express-session");

const routes = require("./routes");
const routesAdmin = require("./routes.admin");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cookieSession({
    name: "session",
    secret: "c293x8b6234z82n938246bc2938x4zb234",
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(cookieParser("keyboard cat"));
app.use(
  session({
    secret: "SecretStringForSession",
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.static(__dirname + "../../public"));
app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());
app.use("/admin", routesAdmin);
app.use(routes);

app.listen(PORT, () => console.log("HTTP server is running..."));
