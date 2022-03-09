import { Request, Response, NextFunction } from 'express';
import { makeResponse } from '../utils/api.util';

import jwt from 'jsonwebtoken';
import config from '../configs/config';
import httpStatus from 'http-status-codes';

function authHandler(req: Request, res: Response, next: NextFunction) {
    const header = req.header('authorization');
    const unauthorizedRes = makeResponse({
        success: false,
        statusCode: httpStatus.UNAUTHORIZED,
        message: "You don't have an account session"
    });

    if (!header || !header.includes('Bearer')) {
        return unauthorizedRes.send(res);
    }

    const token = header.split(' ')[1];
    try {
        jwt.verify(token, config.jwt.accessSecret, {
            complete: true
        });

        return next();
    } catch (err) {
        return unauthorizedRes.send(res);
    }
}

export default authHandler;