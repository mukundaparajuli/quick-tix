import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import ApiResponse from "../types/api-response";
import { env } from "../config/env.config";
import jwt from "jsonwebtoken"

export const JwtValidation = asyncHandler(async (req: Request, res: Response, next) => {
    console.log(req.headers)
    let token = req.headers.authorization?.split(" ")[1] || req.cookies.jwtToken;
    console.log("token=", token)
    if (!token) {
        return new ApiResponse(res, 404, "Token not found");
    }

    jwt.verify(token, env.JWT_SECRET_KEY as string, (err: any, decoded: any) => {
        if (err) {
            console.error("JWT Verification Error:", err);
            return new ApiResponse(res, 403, "JWT verification failed. Please login again", null, err);
        }

        req.user = decoded.user;
        next();
    });
});
