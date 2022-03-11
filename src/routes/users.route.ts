import { Router } from 'express';
import {
    registerUserSchema,
    loginUserSchema
} from '../validations/user.validation';

import validateHandler from '../middlewares/validate.middleware';
import * as controller from '../controllers/users.controller';

const router = Router();

router.post('/register',
    validateHandler(registerUserSchema),
    controller.registerUser
);
router.post('/login',
    validateHandler(loginUserSchema),
    controller.loginUser
);

export default router;