import User from '../models/User';
import {Request, Response, NextFunction} from 'express';
import ErrorResponse from '../../utils/errorResponse';
import IUser from '../../utils/IUser';


// @ts-ignore
export function root(req: Request, res: Response, next: NextFunction) {
    res.send('Hello');
}

export async function register(req: Request, res: Response, next: NextFunction) {
    const { name, email,  password, address } = req.body;

    try {
        const user = await User.create({
            name,
            email,
            password,
            address
        });

        sendTokenResponse(user, 200, res, user.role);
    } catch(err) {
        return next(new ErrorResponse(res, err, 400).catcher());
    }

}

function sendTokenResponse(user: IUser, statusCode: number, res: Response, role: string) {
    const accessToken = user.getSignedJwtToken(res);
    res
    .status(statusCode)
    .json({
        success: true,
        accessToken,
        userId: user._id,
        role
    });
}