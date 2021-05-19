import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../../utils/errorResponse';
import { verify } from 'jsonwebtoken';
import User from '../models/User';
import { jwtAccessSecret } from '../../config/config';
// import IRequest from '../interfaces/IRequest';



// Middleware to verify tokens and ensure that
// users are properly logged in to access certain routes
export async function protect(req: Request, res: Response, next: NextFunction) {
    let token: string;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // @ts-ignore
    if (!token) {
        return next(new ErrorResponse(res, 'You\'re not authorized to access this', 401).catcher());
    }

    try {
        const decoded: any = verify(token, jwtAccessSecret);
        // @ts-ignore
        req.user = await User.findById(decoded.id);
        next();
    } catch(err) {
        console.log(err);
        res.json({
            status: "failed",
            message: err
        });
    }
}