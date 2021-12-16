import express from 'express';

import * as controller from '../controllers/users';
import User from '../models/user';

const router = express.Router();

router.get('/login', async (req, res) => {
    const body = req.body;
    const isValidLogin = Boolean(body.user) && Boolean(body.pwd);

    if (!isValidLogin) {
        return res.send({
            status: 'error',
            message: 'Invalid body content!'
        });
    }

    const user = new User();
    user.name = body.user;
    user.password = body.pwd;

    controller.testLogin(user);
});

router.get('/register', async (req, res) => {
    // TODO: implement registration
});

export default router;