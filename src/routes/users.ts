import { Router } from 'express';
import * as controller from '../controllers/users';
import User from '../models/user';

const router = Router();

router.post('/register', async (req, res) => {
    const { body } = req;

    const user = new User(
        User.UNREGISTERED_ID,
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

router.post('/login', async (req, res) => {
    const { body } = req;

    const user = new User(body.username, body.password);
    const success = await controller.loginUser(user);
    // TODO: add token or something to have access to the account
    const msg = { status: 'success' };

    if (!success) {
        msg.status = 'error';
    }

    res.send(msg);
});

export default router;