import { Request, Response } from "express";
import ApiResponse from "../types/api-response";
import db from "../config/db";
import asyncHandler from "../utils/async-handler";
import bcrypt from 'bcrypt'
import { User } from "../types/types";
import jwt from 'jsonwebtoken'
import logger from "../logger";



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

    const data: User = {
        fullName,
        username,
        email,
        role,
        password: hashedPassword
    }
    console.log(data);
    const newUser: User = await db.user.create({
        data: data
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return new ApiResponse(res, 200, 'Register Successful', userWithoutPassword, null);
})




// login a user

export const LoginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, username, password } = await req.body;

    // if (email or username) or password is not present send error 
    if (!(email || username) || !password) {
        return new ApiResponse(res, 400, 'All fields are required', null, null);
    }

    let validUser;

    // if email is provided find user by email
    if (email) {
        validUser = await db.user.findUnique({
            where: {
                email
            }
        })
    }

    // if username is provided find user by username
    if (username) {
        validUser = await db.user.findUnique({
            where: {
                username
            }
        })
    }

    // if not valid user send error
    if (!validUser) {
        return new ApiResponse(res, 404, "User not found", null, null);
    }

    // here we will have the valid user
    const checkPassword = await bcrypt.compare(password, validUser.password);

    // check if password is valid
    if (!checkPassword) {
        return new ApiResponse(res, 403, "Wrong Password", null, null);
    }

    const userPayload = {
        id: validUser.id,
        fullName: validUser.fullName,
        username: validUser.username,
        email: validUser.email,
        role: validUser.role,
    }
    console.log("user payload: ", userPayload)
    const secret = process.env.JWT_SECRET_KEY;

    if (!secret) {
        return new ApiResponse(res, 500, 'Secret keys are not defined', null, null);
    }

    // Generate tokens
    const jwtToken = jwt.sign({ user: userPayload }, secret, { expiresIn: '1d' });

    // store the tokens in cookies 
    res.cookie('jwtToken', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
    });

    return new ApiResponse(res, 200, "Login Successful", userPayload, null);
})


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
