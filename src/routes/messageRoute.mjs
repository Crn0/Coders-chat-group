import { Router } from 'express';
import * as MessageController from '../controllers/messageController.mjs';

const app = Router();

// MESSAGE ROUTES

// GET
app.get('/new', MessageController.new_get);

app.get('/secret/new', MessageController.secret_new_get);

// POST
app.post('/new', MessageController.new_post);

app.post('/secret/new', MessageController.secret_new_post);

app.post('/delete', MessageController.delete_post);
export default app;
