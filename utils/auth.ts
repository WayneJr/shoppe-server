import { sign } from 'jsonwebtoken';
import { jwtAccessSecret, jwtRefreshSecret, nodeEnv } from '../config/config';
import IUser from './IUser';

export function createAccessToken(user: IUser) {
    const options: {[k: string]: any} = {
        expiresIn: "15m",
    };
    if (nodeEnv === 'production') {
        options.secure = true;
    }

    return sign({id: user._id}, jwtAccessSecret, options);
}

export function createRefreshToken(user: IUser) {
    const options: {[k: string]: any} = {
        expiresIn: "24h",
    };
    if (nodeEnv === 'production') {
        options.secure = true;
    }

    return sign({id: user._id, tokenVersion: user.tokenVersion}, jwtRefreshSecret, options);
}

