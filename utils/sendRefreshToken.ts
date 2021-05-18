import {Response} from 'express';

export default function sendRefreshToken(res: Response, token: string) {
    res.cookie('refreshToken', token, {
        httpOnly: true
    });
}