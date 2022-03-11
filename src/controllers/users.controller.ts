import bcrypt from 'bcrypt';
import User from '../entities/user.entity';
import jwt from 'jsonwebtoken';
import config from '../configs/config';
import * as utils from '../utils/users.util';

import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { sendResponse } from '../utils/api.util';
import {
    RegisterUserType,
    LoginUserType
} from '../validations/user.validation';

export async function registerUser(req: Request, res: Response) {
    const body = req.body as RegisterUserType;
    const userExist = await utils.doesUserExist({ email: body.email });

    if (userExist) {
        return sendResponse(res, {
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'User is already registered'
        });
    }

    const hashedPwd = await bcrypt.hash(body.password, config.hash.rounds);
    const user = User.create({ ...body, password: hashedPwd });

    try {
        await user.save();
    } catch (err) {
        return sendResponse(res, {
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Failed to register user'
        });
    }

    return sendResponse(res, {
        message: 'Successfully registered new user'
    });
}

export async function loginUser(req: Request, res: Response) {
    const body = req.body as LoginUserType;
    const foundUser = await utils.findUser({ email: body.email });

    if (!foundUser) {
        return sendResponse(res, {
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Username or password is incorrect'
        });
    }

    try {
        // the password from user object isn't hashed, we can just check it.
        const success = bcrypt.compare(body.password, foundUser.password);
        if (!success) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.BAD_REQUEST,
                message: 'Username or password is incorrect'
            });
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

        return sendResponse(res, {
            message: 'User successfully loggedin',
            data: { accessToken }
        });
    } catch (err) {
        return sendResponse(res, {
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'An error occurred on login'
        });
    }
}