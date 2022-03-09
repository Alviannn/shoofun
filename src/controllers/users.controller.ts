import bcrypt from 'bcrypt';
import User from '../entities/user.entity';
import jwt from 'jsonwebtoken';
import joi from 'joi';
import httpStatus from 'http-status-codes';
import * as utils from '../utils/users.util';

import { Request, Response } from 'express';
import { makeResponse } from '../utils/api.util';
import { registerUserSchema, loginUserSchema } from '../validations/user.validation';

export async function registerUser(req: Request, res: Response) {
    const result = registerUserSchema.validate(req.body);
    if (result.error) {
        return makeResponse({
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: result.error.message
        }).send(res);
    }

    const { value } = result as joi.ValidationResult<User>;
    const userExist = await utils.doesUserExist({ email: value!.email });

    if (userExist) {
        return makeResponse({
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: 'User is already registered'
        }).send(res);
    }

    const hashedPwd = await bcrypt.hash(value!.password, utils.HASH_ROUNDS);
    const user = User.create({ ...value, password: hashedPwd });

    try {
        await user.save();
    } catch (err) {
        return makeResponse({
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: 'Failed to register user'
        }).send(res);
    }

    return makeResponse({ message: 'Successfully registered new user' }).send(res);
}

export async function loginUser(req: Request, res: Response) {
    const { body } = req;

    const result = loginUserSchema.validate(body);
    if (result.error) {
        return makeResponse({
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: result.error.message
        }).send(res);
    }

    const { value: user } = result as joi.ValidationResult<User>;
    const foundUser = await utils.findUser({ username: user!.username });

    if (!foundUser) {
        return makeResponse({
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: 'Username or password is incorrect'
        }).send(res);
    }

    try {
        // the password from user object isn't hashed, we can just check it.
        const success = bcrypt.compare(user!.password, foundUser.password);
        if (!success) {
            return makeResponse({
                success: false,
                statusCode: httpStatus.BAD_REQUEST,
                message: 'Username or password is incorrect'
            }).send(res);
        }

        const accessToken = jwt.sign(
            { username: foundUser.username, email: foundUser.email },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: '15s', notBefore: '5s' }
        );

        return makeResponse({
            message: 'User successfully loggedin'
        })
            .add('accessToken', accessToken)
            .send(res);
    } catch (err) {
        return makeResponse({
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: 'An error occurred on login'
        }).send(res);
    }
}