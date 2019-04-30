const express = require("express");
const nunjucks = require("nunjucks");

const app = express();

//define a porta do server
app.listen(7070);

//configura o nunjucks para o funcionamento correto das views
nunjucks.configure("views", {
  autoescape: true,
  watch: true,
  express: app
});

//define a view engine
app.set("view engine", "njk");

// prepara o servidor para saber como lidar com paramêtro via http
app.use(express.urlencoded({ extended: false }));

const validatorMiddleware = (req, res, next) => {
  let idade = req.query.age;

  if (!idade) {
    return res.redirect("/");
  } else {
    return next();
  }
};

//rotas
app.get("/", (req, res) => {
  return res.render("create");
});

app.post("/check", (req, res) => {
  let idade = req.body.age;

  if (idade) idade = parseInt(idade);
  else return res.redirect("/error");

  if (idade >= 18) return res.redirect(`/major?age=${idade}`);
  else return res.redirect(`/minor?age=${idade}`);
});

app.get("/major", validatorMiddleware, (req, res) => {
  return res.render("major", { age: req.query.age });
});

app.get("/minor", validatorMiddleware, (req, res) => {
  return res.render("major", { age: req.query.age });
});
