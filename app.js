//import express
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: false })); //middlewar used to make working with incoming data easier parses the body and turns it into readable text (good for form inputs)
app.use(cookieParser());
app.use(express.static("static"));

app.set("view engine", "pug");

//import routes
const mainRoutes = require("./routes");
const quizRoutes = require("./routes/quiz");
const createRoutes = require("./routes/create");
const editRoutes = require("./routes/edit");
const deleteRoutes = require("./routes/delete");
const userRoutes = require("./routes/user");

//use routes
app.use(mainRoutes);
app.use(userRoutes);
app.use("/quiz", quizRoutes);
app.use(createRoutes);
app.use(editRoutes);
app.use(deleteRoutes);

//404
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});
//Error handling
app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status); //sets server status to 500
  res.render("error");
});

//create server
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
