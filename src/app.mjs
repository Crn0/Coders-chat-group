import 'dotenv/config';
import express from "express";
import createError from "http-errors";
import { join } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index.mjs";
import usersRouter from "./routes/users.mjs";

// Init dir name variable
const { dirname } = import.meta;

const app = express();

// view engine setup
app.set("views", join(dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, _) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
