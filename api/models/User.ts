import { Schema, model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import IUser from '../interfaces/IUser';
import crypto from 'crypto';
import { createAccessToken, createRefreshToken } from '../../utils/auth';
import sendRefreshToken from '../../utils/sendRefreshToken';
import { Response } from 'express';

const userSchema: Schema<IUser> = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Please enter a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email"
        ],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        trim: true,
        select: false
    },
    address: {
        type: String,
        required: [true, 'Please enter an address'],
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },
    // phone: {
    //     type: String,
    //     required: [true, 'Please enter a phone number'],
    //     trim: true
    // },
    tokenVersion: Number,
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true
});

userSchema.pre<IUser>('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getSignedJwtToken = function(res: Response) {
    sendRefreshToken(res, createRefreshToken(this));
    return createAccessToken(this);
};

userSchema.methods.matchPassword = async function(enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
    return resetToken;
};

export default model<IUser>('User', userSchema);