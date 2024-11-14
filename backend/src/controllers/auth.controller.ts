import { Request, Response } from "express";
import ApiResponse from "../types/api-response";
import db from "../config/db";
import asyncHandler from "../utils/async-handler";
import bcrypt from 'bcrypt'
import { User } from "../types/types";
import jwt from 'jsonwebtoken'
import logger from "../logger";
import { generateVerificationToken } from "../utils/generate-verification-code";
import { sendVerificationEmail } from "../utils/send-verification-email";



// register a user
export const RegisterUser = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, username, email, password, role } = await req.body;

    if (!fullName || !username || !email || !password) {
        return new ApiResponse(res, 400, 'All fields are required', null, null);
    }

    // check if email is already in use
    const checkEmail = await db.user.findUnique({
        where: {
            email
        }
    })
    if (checkEmail) {
        return new ApiResponse(res, 403, "Email is already in use", null, null);
    }


    // check if username is already in use
    const checkUsername = await db.user.findUnique({
        where: {
            username
        }
    })
    if (checkUsername) {
        return new ApiResponse(res, 403, "Username unavailable. Please use other username", null, null);
    }


    const hashedPassword: string = await bcrypt.hash(password, 10);

    const newUser: User = await db.user.create({
        data: {
            fullName,
            username,
            email,
            role,
            password: hashedPassword
        }
    });

    // send verification email
    const verificationToken = generateVerificationToken(newUser);
    const { data, error } = await sendVerificationEmail(newUser.email, verificationToken);
    console.log(data, error);

    const { password: _, ...userWithoutPassword } = newUser;
    return new ApiResponse(res, 200, 'Register Successful', userWithoutPassword, null);
})




// login a user

export const LoginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, username, password } = await req.body;

    if (!(email || username) || !password) {
        return new ApiResponse(res, 400, 'All fields are required', null, null);
    }

    let validUser;

    if (email) {
        validUser = await db.user.findUnique({
            where: { email }
        });
    }

    if (username) {
        validUser = await db.user.findUnique({
            where: { username }
        });
    }

    if (!validUser) {
        return new ApiResponse(res, 404, "User not found", null, null);
    }

    const checkPassword = await bcrypt.compare(password, validUser.password);

    if (!checkPassword) {
        return new ApiResponse(res, 403, "Wrong Password", null, null);
    }

    const userPayload = {
        id: validUser.id,
        fullName: validUser.fullName,
        username: validUser.username,
        email: validUser.email,
        role: validUser.role,
    };

    const secret = process.env.JWT_SECRET_KEY;

    if (!secret) {
        return new ApiResponse(res, 500, 'Secret keys are not defined', null, null);
    }

    const jwtToken = jwt.sign({ user: userPayload }, secret, { expiresIn: '1d' });


    return new ApiResponse(res, 200, "Login Successful", { userPayload, jwtToken }, null);
});

// logout user


export const LogOutUser = asyncHandler(async (req: Request, res: Response) => {
    res.cookie('jwtToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0),
    });

    logger.info('User logged out successfully');

    // Send a success response
    return new ApiResponse(res, 200, "Logout successful", null, null);
});

export const VerifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { verificationToken } = req.params;

    logger.info("verification token: ", verificationToken)
    const decoded = jwt.verify(verificationToken, process.env.JWT_SECRET_KEY as string);
    logger.info("decoded: ", decoded)

    if (!decoded || typeof decoded === 'string') {
        return new ApiResponse(res, 400, "Invalid verification token", null, null);
    }

    // decoded.id
    const userId = decoded.id;
    logger.info("user id: ", userId)

    const user = await db.user.findUnique({
        where: {
            id: userId
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
