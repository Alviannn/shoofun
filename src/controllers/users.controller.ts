import bcrypt from 'bcrypt';
import User from '../entities/user.entity';
import jwt from 'jsonwebtoken';
import config from '../configs/config';
import * as utils from '../utils/users.util';

import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { makeResponse } from '../utils/api.util';
import { registerUserSchema, loginUserSchema } from '../validations/user.validation';

export async function registerUser(req: Request, res: Response) {
    const result = registerUserSchema.validate(req.body);
    if (result.error) {
        return makeResponse({
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: result.error.message
        }).send(res);
    }

    const { value } = result;
    const userExist = await utils.doesUserExist({ email: value!.email });

    if (userExist) {
        return makeResponse({
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'User is already registered'
        }).send(res);
    }

    const hashedPwd = await bcrypt.hash(value!.password, config.hash.rounds);
    const user = User.create({ ...value, password: hashedPwd });

    try {
        await user.save();
    } catch (err) {
        return makeResponse({
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
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
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: result.error.message
        }).send(res);
    }

    const { value } = result;
    const foundUser = await utils.findUser({ email: value!.email });

    if (!foundUser) {
        return makeResponse({
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Username or password is incorrect'
        }).send(res);
    }

    try {
        // the password from user object isn't hashed, we can just check it.
        const success = bcrypt.compare(value!.password, foundUser.password);
        if (!success) {
            return makeResponse({
                success: false,
                statusCode: StatusCodes.BAD_REQUEST,
                message: 'Username or password is incorrect'
            }).send(res);
        }

        const accessToken = jwt.sign(
            {
                username: foundUser.username,
                email: foundUser.email
            },
            config.jwt.accessSecret,
            {
                expiresIn: config.jwt.expireTime,
                notBefore: config.jwt.notBeforeTime
            }
        );

        return makeResponse({
            message: 'User successfully loggedin'
        })
            .add('accessToken', accessToken)
            .send(res);
    } catch (err) {
        return makeResponse({
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'An error occurred on login'
        }).send(res);
    }
}