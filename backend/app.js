
require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const logger = require("morgan");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const { Kitten } = require("./mongo/schema");

app.use(express.json());
app.use(cors());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use("/", indexRouter);
app.use("/users", usersRouter);

const db = process.env.db
mongoose.connect(db);

mongoose.connection
  .once("open", function () {
    console.log("Connected");
  })
  .on("error", function (error) {
    console.log("CONNECTION ERROR:", error);
  });

// catch 404 and forward to error handler

app.use(function (req, res, next) {

  next(createError(404));
});

// error handler

app.use(function (err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page

  res.status(err.status || 500);
  res.send("error");
});

const port = 3001;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;