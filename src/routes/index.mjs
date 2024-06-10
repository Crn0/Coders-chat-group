import { Router } from 'express';

const router = Router();

/* GET home page. */
router.get('/', (req, res, _) => {
    res.render('index', { title: 'Express' });
});

export default router;
