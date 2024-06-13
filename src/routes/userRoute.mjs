import express from 'express';
import * as UserController from '../controllers/userController.mjs';

const app = express.Router();

// USER ROUTES

// GET
app.get('/:id', UserController.profile);

app.get('/:id/delete', UserController.delete_get);

app.get('/logout', UserController.logout_get);


// POST
app.post('/:id/delete', UserController.delete_post);

export default app;
