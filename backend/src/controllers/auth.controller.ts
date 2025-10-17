import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import ApiError from "../types/api-error";
import { UserRole } from "@prisma/client";
import { authService } from "../services/auth.service";
import { generateEmailVerificationToken, generateJwtToken } from "../utils/generate-verification-code";
import { sendVerificationEmail } from "../utils/send-verification-email";
import ApiResponse from "../types/api-response";

export const RegisterUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role, bio, phone, organizationName } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "Name, email, and password are required");
    }

    if (!Object.values(UserRole).includes(role)) {
        throw new ApiError(400, "Invalid user role");
    }

    // check if user already exists
    const emailExists = await authService.getUserByEmail(email);
    if (emailExists) {
        throw new ApiError(400, "Email already in use");
    }

    // else create user
    const createdUser = await authService.createUser({ name, email, password, role });

    // create profile based on role
    if (role === UserRole.ATTENDEE) {
        await authService.createAttendeeProfile({
            userId: createdUser.id,
            bio,
            phone,
        });
    } else if (role === UserRole.ORGANIZER) {
        if (!organizationName) {
            throw new ApiError(400, "Organization name is required for organizers");
        }

        await authService.createOrganizerProfile({
            userId: createdUser.id,
            organizationName,
            contactEmail: email,
        });
    }

    const userWithProfile = await authService.getUserById(createdUser.id);

    const verificationToken = generateEmailVerificationToken(userWithProfile);
    await sendVerificationEmail(email, verificationToken);

    return new ApiResponse(res, 201, "User registered successfully", userWithProfile);
});

export const LoginUser = asyncHandler(async (req: Request, res: Response) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await authService.getUserByEmail(email);
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await authService.verifyPassword(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const userWithProfile = await authService.getUserById(user.id);
    const isVerified = userWithProfile?.verified;
    if (!isVerified) {
        const verificationToken = generateEmailVerificationToken(userWithProfile);
        await sendVerificationEmail(email, verificationToken);
        throw new ApiError(403, "Please verify your email before logging in");
    }

    const jwtToken = generateJwtToken(userWithProfile);
    return new ApiResponse(res, 200, "Login successful", { token: jwtToken, user: userWithProfile });
});


export const VerifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { verificationToken } = req.params;
    if (!verificationToken || typeof verificationToken !== 'string') throw new ApiError(400, 'Verification token is required');

    const user = await authService.verifyEmailToken(verificationToken);

    return new ApiResponse(res, 200, 'Email verified successfully', { user });
});