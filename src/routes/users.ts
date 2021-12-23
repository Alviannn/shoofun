import { Router } from 'express';
import * as controller from '../controllers/users';

const router = Router();

router.post('/register', controller.registerUser);
router.post('/login', controller.loginUser);

export default router;