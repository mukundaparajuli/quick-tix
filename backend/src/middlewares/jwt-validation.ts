import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import ApiResponse from "../types/api-response";
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import logger from "../logger";

export const JwtValidation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.cookies);
    const token = req.cookies.jwtToken;

    if (!token) {
        return new ApiResponse(res, 404, "Token not found", null, null);
    }

    const secret = process.env.JWT_SECRET_KEY;

    if (!secret) {
        return new ApiResponse(res, 404, "Secret key is not available", null, null);
    }

    jwt.verify(token, secret, (err: any, decoded: any) => {
        if (err) {
            return new ApiResponse(res, 403, "JWT verification failed. Unauthorized", null, null);
        }

        logger.info("Decoded Token: ");
        logger.info({ decoded });

        if (decoded) {
            req.user = decoded.user;
        }

        next();
    });
});
