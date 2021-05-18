import { root, register } from '../controllers/auth';
import { Router } from 'express';

export const router: Router = Router();

router.get('/', root);

router.post('/register', register);
