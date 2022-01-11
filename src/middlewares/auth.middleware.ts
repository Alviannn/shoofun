import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

function authHandler(req: Request, _: Response, next: NextFunction) {
    const header = req.header('authorization');
    if (!header || !header.includes('Bearer')) {
        return;
    }

    const token = header.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err) => {
        if (err) {
            // TODO: redirect user to login page
            return console.error(err.message);
        }

        next();
    });
}

export default authHandler;