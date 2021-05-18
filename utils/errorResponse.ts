import { Response } from "express";

export default class ErrorResponse extends Error {
    // property declarations
    statusCode: number;
    res: Response;

    constructor(res: Response, message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.res = res;
    }

    catcher() {
        return this.res
        .status(this.statusCode)
        .json({
            success: false,
            message: this.message
        });
    }
}