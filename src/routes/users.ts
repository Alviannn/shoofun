import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/login', async (req, res) => {
    const { body } = req;
    const isValidLogin = 'user' in body && 'pwd' in body;

    if (!isValidLogin) {
        return res.send({
            status: 'error',
            message: 'Invalid body content!'
        });
    }

    // TODO: verify user login
});

export default router;