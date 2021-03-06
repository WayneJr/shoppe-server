import User from '../models/User';
import {Request, Response, NextFunction} from 'express';
import ErrorResponse from '../../utils/errorResponse';
import IUser from '../interfaces/IUser';


// @ts-ignore
export function root(req: Request, res: Response, next: NextFunction) {
    res.send('Hello');
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @description The Registration controller for the API
 * @returns JSON response containing user details
 */

export async function register(req: Request, res: Response, next: NextFunction) {
    const { name, email,  password, address } = req.body;

    try {
        const user: IUser = await User.create({
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

export async function login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorResponse(res, "Please provide an email and a password", 400).catcher());
    }

    try {
        const user: IUser | null = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorResponse(res, 'No such user found', 400).catcher());
        }

        const isMatch: boolean = await user.matchPassword(password);
        if (!isMatch) {
            return next(new ErrorResponse(res, 'You entered an incorrect password', 400).catcher());
        }

        sendTokenResponse(user, 200, res, user.role);
    } catch (error) {
        return next(new ErrorResponse(res, error, 400).catcher());
    }
}

export async function loggedInUser(req: Request, res: Response, next: NextFunction) {
    try {
        // @ts-ignore
        const user: IUser | null = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch(err) {
        return next(new ErrorResponse(res, err, 503).catcher());
    }
}



// function for returning results to the client
function sendTokenResponse(user: IUser, statusCode: number, res: Response, role: string) {
    const accessToken: string = user.getSignedJwtToken(res);
    res
    .status(statusCode)
    .json({
        success: true,
        accessToken,
        userId: user._id,
        role
    });
}