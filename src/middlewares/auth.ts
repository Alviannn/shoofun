import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

function authHandler(req: Request, res: Response, next: NextFunction) {
    const header = req.header('authorization');
    if (!header || !header.includes('Bearer')) {
        return;
    }

    const token = header.split(' ')[1];
    console.log(token);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) {
            return console.error(err.message);
        }

        console.log(decode);
        next();
    });
}

export default authHandler;