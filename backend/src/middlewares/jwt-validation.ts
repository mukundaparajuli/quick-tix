import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import ApiResponse from "../types/api-response";
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import logger from "../logger";



export const JwtValidation = asyncHandler(async (req: Request, res: Response, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return new ApiResponse(res, 404, "Token not found");
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err: any, decoded: any) => {
            if (err) {
                console.log(err);
                return new ApiResponse(res, 403, "JWT verification failed. Please Login again", null, err);
            }



            if (decoded) {
                req.user = decoded.user;
            }

            next();
        });
    } catch (error) {
        return new ApiResponse(res, 401, "Invalid token", null, null);
    }
});