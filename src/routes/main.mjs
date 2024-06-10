import express from "express";
import * as UserController from "../controllers/userController.mjs";
import * as MessageController from "../controllers/messageController.mjs";

const app = express.Router();

// USER ROUTES
// GET
app.get("/", UserController.index);

app.get("/minor_arcana", UserController.home);

app.get("/major_arcana", UserController.secret_page);

app.get("/register", UserController.register_get);

app.get("/login", UserController.login_get);

app.get("/logout", UserController.logout_get);

app.get("/user/:id", UserController.profile);

app.get("/user/:id/delete", UserController.delete_get);

// POST
app.post("/register", UserController.register_post);

app.post("/login", UserController.login_post);

app.post("/user/:id/delete", UserController.delete_post);

// MESSAGE ROUTES
// GET
app.get("/message/new", MessageController.new_get);

app.get("/message/secret/new", MessageController.secret_new_get);

// POST
app.post("/message/new", MessageController.new_post);

app.post("/message/secret/new", MessageController.secret_new_post);

app.post("/message/delete", MessageController.delete_post);

export default app;
