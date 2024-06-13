import { Router } from 'express';
import * as IndexController from '../controllers/indexController.mjs';

const app = Router();

// GET
app.get('/', IndexController.index);

app.get('/minor_arcana', IndexController.home);

app.get('/major_arcana', IndexController.secret_page);

app.get('/register', IndexController.register_get);

app.get('/login', IndexController.login_get);


// POST
app.post('/register', IndexController.register_post);

app.post('/login', IndexController.login_post);

export default app;
