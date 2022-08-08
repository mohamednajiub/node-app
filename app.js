const express = require("express");
const bodyParser = require("body-parser");

const path = require("path");

const expressHBS = require("express-handlebars");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

var handlebars = expressHBS.create({
  extname: ".hbs",
  // helpers: handlebarsHelpers,
});
app.engine(".hbs", handlebars.engine);
app.set("view engine", ".hbs");

app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render("404", {
    docTitle: "Page Not Found",
  });
});

app.listen(3000);
