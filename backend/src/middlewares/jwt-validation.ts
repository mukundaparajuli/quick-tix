import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import ApiResponse from "../types/api-response";
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

export const JwtValidation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.Token;

    // Check if token exists
    if (!token) {
        return new ApiResponse(res, 404, "Token not found", null, null);
    }

    const secret = process.env.JWT_SECRET_KEY;

    // Check if secret key is available
    if (!secret) {
        return new ApiResponse(res, 404, "Secret key is not available", null, null);
    }

    // Verify the token
    jwt.verify(token, secret, (err: VerifyErrors | null, decoded: JwtPayload | undefined) => {
        if (err) {
            return new ApiResponse(res, 403, "JWT verification failed. Unauthorized", null, null);
        }


        if (decoded) {
            req.user = decoded.user;
        }


        next();
    });
});
