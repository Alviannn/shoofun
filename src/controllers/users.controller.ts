import bcrypt from 'bcrypt';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import * as utils from '../utils/users.util';

import { psql } from '../main';
import { Request, Response } from 'express';

/**
 * Registers a user to the database.
 * Upon receiving the object, it should already been checked in the frontend.
 *
 * NOTE: There's no double check for web scraper.
 */
export async function registerUser(
    req: Request, res: Response): Promise<unknown> {

    const { body } = req;
    // incomplete form of the object from client
    const user = new User(
        User.UNREGISTERED_ID,
        body.username, body.email, body.password,
        body.display, body.phone
    );

    const userExist = await utils.doesUserExist({ email: user.email });
    const msg = { status: 'success', message: 'Successfully registered user!' };

    if (userExist) {
        msg.status = 'error';
        msg.message = 'User is already registered!';

        return res.status(400).json(msg);
    }

    // the password from user isn't hashed
    const hashedPwd = await bcrypt.hash(user.password!, utils.HASH_ROUNDS);

    try {
        await psql.query(
            `INSERT INTO users
                (username, email, password, display, phone)
            VALUES
                ($1, $2, $3, $4, $5);`,
            [user.username, user.email, hashedPwd, user.display, user.phone]
        );
    } catch (err) {
        msg.status = 'error';
        msg.message = 'Failed to register user!';

        return res.status(500).json(msg);
    }

    return res.json(msg);
}

export async function loginUser(req: Request, res: Response): Promise<unknown> {
    const { body } = req;

    const user = new User(body.username, body.password);
    const msg = { status: 'success', message: 'User successfully logs-in' };

    const foundUser = await utils.findUser({ username: user.username });
    if (!foundUser) {
        msg.status = 'error';
        msg.message = 'Username or password is incorrect!';

        return res.status(400).json(msg);
    }

    try {
        // the password from user object isn't hashed, we can just check it.
        const success = bcrypt.compare(user.password!, foundUser.password!);
        if (!success) {
            msg.status = 'error';
            msg.message = 'Username or password is incorrect';

            return res.status(400).json(msg);
        }

        const accessToken = jwt.sign(
            { username: foundUser.username, email: foundUser.email },
            process.env.ACCESS_TOKEN_SECRET!
        );

        Object.assign(msg, { accessToken });

        return res.json(msg);
    } catch (err) {
        msg.status = 'error';
        msg.message = 'Failed to login user!';

        return res.status(500).json(msg);
    }
}