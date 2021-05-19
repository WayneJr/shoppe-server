import { root, register, login } from '../controllers/auth';
import { Router } from 'express';

export const router: Router = Router();

router.get('/', root);

router.post('/register', register);
router.post('/login', login);
