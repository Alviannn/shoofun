import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '../utils/api.util';

import jwt from 'jsonwebtoken';
import config from '../configs/config';

function authHandler(req: Request, res: Response, next: NextFunction) {
    const header = req.header('authorization');

    if (!header || !header.includes('Bearer')) {
        return sendResponse(res, {
            success: false,
            statusCode: StatusCodes.UNAUTHORIZED,
            message: "You don't have an account session"
        });
    }

    const token = header.split(' ')[1];
    try {
        jwt.verify(token, config.jwt.accessSecret, {
            complete: true
        });

        return next();
    } catch (err) {
        return sendResponse(res, {
            success: false,
            statusCode: StatusCodes.UNAUTHORIZED,
            message: "You don't have an account session"
        });
    }
}

export default authHandler;