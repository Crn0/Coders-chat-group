import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import __dirname from "../dirname.mjs";
import createError from "http-errors";
import { join } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import * as PassportConfig from "./configs/passport.mjs";
import SessionConfig from "./configs/session.mjs";
import mainRouter from "./routes/main.mjs";

const app = express();

// Define the database URL to connect to.
const mongoDb = process.env.MONGO_DB;

// Wait for database to connect, logging an error if there is a problem
const main = async () => await mongoose.connect(mongoDb);
main().catch(console.error);

// Passport local strategy
passport.use(PassportConfig.strategy);

passport.serializeUser(PassportConfig.serializeUser);
passport.deserializeUser(PassportConfig.deserializeUser);

// view engine setup
app.set("views", join(__dirname, "src/views"));
app.set("view engine", "pug");

app.use(SessionConfig);
app.use(passport.session());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));
app.use((req, res, next) => {
  res.locals.currentUser = req?.user;
  res.locals.isMember = req.user?.member;
  res.locals.isAdmin = req.user?.admin;
  res.locals.isAuthenticated = req?.isAuthenticated?.()
  res.locals.loginErrors = [...new Set(req.session?.messages)];
  
  next();
});

app.use("/", mainRouter);

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
