const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cookieSession({
    name: "session",
    secret: "c293x8b6234z82n938246bc2938x4zb234",
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.static(__dirname + "../../public"));

app.listen(PORT, () => console.log("HTTP server is running..."));
