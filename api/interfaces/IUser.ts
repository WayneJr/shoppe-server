import { Response } from 'express';
import { Document } from 'mongoose';

export default interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    address: string;
    role: string;
    tokenVersion: string;
    resetPasswordToken: string;
    resetPasswordExpire: Date;
    getSignedJwtToken(res: Response): string;
    matchPassword(enteredPassword: string): Promise<boolean>;
    getResetPasswordToken(): string;
}