import { Request, Response } from "express";
import ApiResponse from "../types/api-response";
import db from "../config/db";
import asyncHandler from "../utils/async-handler";
import jwt from 'jsonwebtoken'
import { generateVerificationToken } from "../utils/generate-verification-code";
import { sendVerificationEmail } from "../utils/send-verification-email";
import { authService } from "../services/auth.service";
import { env } from "../config/env.config";



// register a user
export const RegisterUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.registerUser(req);

    // send verification email
    const verificationToken = generateVerificationToken(user);
    const data = await sendVerificationEmail(user.email, verificationToken);

    console.log(data);
    const { password, ...userWithoutPassword } = user;
    return new ApiResponse(res, 200, 'Register Successful', userWithoutPassword, null);
})

// register an organizer

export const RegisterOrganizer = asyncHandler(async (req: Request, res: Response) => {
    const { user } = await authService.registerOrganizer(req);

    // send verification email
    const verificationToken = generateVerificationToken(user);
    const data = await sendVerificationEmail(user.email, verificationToken);

    console.log(data);
    const { password, ...userWithoutPassword } = user;
    return new ApiResponse(res, 200, 'Register Successful', userWithoutPassword, null);
})


// login a user

export const LoginUser = asyncHandler(async (req: Request, res: Response) => {
    const { jwtToken, user } = await authService.loginUser(req);

    console.log(user);


    // store the tokens in cookies 
    res.cookie('jwtToken', jwtToken, {
        httpOnly: false,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
    });


    return new ApiResponse(res, 200, "Login Successful", { user, jwtToken }, null);
})


// logout user
export const LogOutUser = asyncHandler(async (req: Request, res: Response) => {
    res.cookie('jwtToken', '', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0),
    });

    return new ApiResponse(res, 200, "Logout successful", null, null);
});

export const VerifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { verificationToken } = req.params;
    const decoded = jwt.verify(verificationToken, env.JWT_SECRET_KEY as string);
    if (!decoded || typeof decoded === 'string') {
        return new ApiResponse(res, 400, "Invalid verification token", null, null);
    }

    const user = await db.user.findUnique({
        where: {
            id: decoded.user.id
        }
    })

    if (!user) {
        return new ApiResponse(res, 404, "User not found", null, null);
    }

    const updatedUser = await db.user.update({
        where: { id: user.id },
        data: { verified: true }
    })

    return new ApiResponse(res, 200, "Email verified successfully", updatedUser, null);
})
