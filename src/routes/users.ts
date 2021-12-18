import express from 'express';

import * as controller from '../controllers/users';
import User from '../models/user';

const router = express.Router();

router.get('/login', async (req, res) => {
    const { body } = req;

    const user = new User(body.username, body.password);
    const success = await controller.testLogin(user);
    // TODO: add token or something to have access to the account
    const msg = { status: 'success' };

    if (!success) {
        msg.status = 'error';
    }

    res.send(msg);
});

router.get('/register', async (req, res) => {
    const { body } = req;

    const user = new User(
        -1,
        body.username, body.email, body.password,
        body.display, body.phone
    );

    const success = await controller.registerUser(user);
    const msg = { status: 'success' };

    if (!success) {
        msg.status = 'error';
    }

    res.send(msg);
});

export default router;