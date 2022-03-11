import bcrypt from 'bcrypt';
import User from '../entities/user.entity';
import jwt from 'jsonwebtoken';
import config from '../configs/config';
import * as utils from '../utils/users.util';

import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { registerUserSchema, loginUserSchema } from '../validations/user.validation';
import { sendResponse } from '../utils/api.util';

export async function registerUser(req: Request, res: Response) {
    const result = registerUserSchema.validate(req.body);
    if (result.error) {
        return sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: result.error.message
        });
    }

    const { value } = result;
    const userExist = await utils.doesUserExist({ email: value!.email });

    if (userExist) {
        return sendResponse(res, {
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'User is already registered'
        });
    }

    const hashedPwd = await bcrypt.hash(value!.password, config.hash.rounds);
    const user = User.create({ ...value, password: hashedPwd });

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
    const { body } = req;

    const result = loginUserSchema.validate(body);
    if (result.error) {
        return sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: result.error.message
        });
    }

    const { value } = result;
    const foundUser = await utils.findUser({ email: value!.email });

    if (!foundUser) {
        return sendResponse(res, {
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Username or password is incorrect'
        });
    }

    try {
        // the password from user object isn't hashed, we can just check it.
        const success = bcrypt.compare(value!.password, foundUser.password);
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
            data: {
                accessToken
            }
        });
    } catch (err) {
        return sendResponse(res, {
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'An error occurred on login'
        });
    }
}