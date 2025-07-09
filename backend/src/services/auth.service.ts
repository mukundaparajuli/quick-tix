import { Request } from "express";
import ApiError from "../types/api-error";
import db from "../config/db";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/send-verification-email";
import { generateVerificationToken } from "../utils/generate-verification-code";

export default class AuthService {
    async registerUser(req: Request) {
        const { fullName, username, email, password, address, city, state, country, latitude, longitude } = req.body;
        if (!fullName || !username || !email || !password) {
            throw new ApiError(400, "Fullname, username, email and password are required fields");
        }

        //check if the email & username already exists or not
        const usernameExists = await db.user.findFirst({ where: username });
        if (usernameExists) throw new ApiError(400, "This username is already in use!")

        const emailExists = await db.user.findFirst({ where: email });
        if (emailExists) throw new ApiError(400, "This email is already in use!");

        //initialize location id
        let locationId = null;

        //check if location is provided in the request or not
        if (address && city && state && country) {
            //create the location through location. service
            // return location id
            // assign locationId variable with that id
        }


        //hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        //create user
        const registeredUser = await db.user.create({
            data: {
                fullName,
                username,
                email,
                password: hashedPassword,
                locationId
            }
        })
        return registeredUser;
    }

    async registerOrganizer(req: Request) {
        const { fullName, username, email, password, businessName, address, city, state, country, latitude, longitude } = req.body;
        if (!fullName || !username || !email || !password || !businessName) {
            throw new ApiError(400, "Fullname, username, businessName, email and password are required fields");
        }

        //check if the email & username already exists or not
        const usernameExists = await db.user.findFirst({ where: username });
        if (usernameExists) throw new ApiError(400, "This username is already in use!")

        const emailExists = await db.user.findFirst({ where: email });
        if (emailExists) throw new ApiError(400, "This email is already in use!");

        //initialize location id
        let locationId = null;

        //check if location is provided in the request or not
        if (address && city && state && country) {
            //create the location through location. service
            // return location id
            // assign locationId variable with that id
        }


        //hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        //create a transaction to create user and organizer profile
        const registeredUser = await db.$transaction(async (tx) => {
            //create user
            const user = await tx.user.create({
                data: {
                    fullName,
                    username,
                    email,
                    password: hashedPassword,
                    locationId,
                }
            });
            // create organizer
            const organizerProfile = await tx.organizerProfile.create({
                data: {
                    businessName: businessName as string,
                    userId: user.id
                }
            })
            return { user, organizerProfile };
        });
        return registeredUser;
    }

    async loginUser(req: Request) {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError(400, "Email and password are required field");
        }

        // find user
        const user = await db.user.findFirst({
            where: {
                email,
                deletedAt: null
            }
        })

        if (!user) {
            throw new ApiError(404, "User not found!");
        }

        // check validity of the password
        const isPasswordValid = bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new ApiError(401, "Unauthorized Invalid Credentials")
        }

        //check if the user is verfied or not
        const isVerified = user.verified;

        if (!isVerified) {
            //first send the verification email
            const verificationToken = generateVerificationToken(user);
            await sendVerificationEmail(user.email, verificationToken);
            throw new ApiError(401, "Please verify your email to login")
        }
        const userPayload = {
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            role: user.role,
        }
        // logger.info("user payload: ", userPayload)
        const secret = process.env.JWT_SECRET_KEY;

        if (!secret) {
            throw new ApiError(404, "Jwt verfication not found")
        }

        // Generate tokens
        const jwtToken = jwt.sign({ user: userPayload }, secret, { expiresIn: '1d' });

        return { jwtToken, user };
    }
}

export const authService = new AuthService();