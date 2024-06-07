import asyncHandler from "express-async-handler";

// GET
const index = asyncHandler(async (req, res, _) => {
  res.send("Index page: GET NOT IMPLEMENTED");
});

const home = asyncHandler(async (req, res, _) => {
  res.send("Home page: GET NOT IMPLEMENTED");
});

const secret_page = asyncHandler(async (req, res, _) => {
  res.send("Secret page: GET NOT IMPLEMENTED");
});

const profile = asyncHandler(async (req, res, _) => {
  res.send("Profile page: GET NOT IMPLEMENTED");
});

const register_get = asyncHandler(async (req, res, _) => {
  res.send("Register page: GET NOT IMPLEMENTED");
});

const login_get = asyncHandler(async (req, res, _) => {
  res.send("Login page: GET NOT IMPLEMENTED");
});

const logout_get = asyncHandler(async (req, res, _) => {
  res.send("Logout page: GET NOT IMPLEMENTED");
});

const delete_get = asyncHandler(async (req, res, _) => {
  res.send("Delete page: GET NOT IMPLEMENTED");
});

// POST
const register_post = asyncHandler(async (req, res, _) => {
  res.send("Register page: POST NOT IMPLEMENTED");
});

const login_post = asyncHandler(async (req, res, _) => {
  res.send("Login page: POST NOT IMPLEMENTED");
});

const delete_post = asyncHandler(async (req, res, _) => {
  res.send("Delete page: POST NOT IMPLEMENTED");
});

export {
  index,
  home,
  secret_page,
  profile,
  register_get,
  login_get,
  delete_get,
  register_post,
  login_post,
  delete_post,
  logout_get,
};
