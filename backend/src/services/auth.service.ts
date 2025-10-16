import { UserRole } from "@prisma/client";
import db from "../config/db";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { compare, hashPassword } from "../utils/hash-password";
import { env } from "../config/env.config";

class AuthService {
    async getUserByEmail(email: string) {
        const user = await db.user.findUnique({
            where: { email },
        });
        return user;
    }

    async createUser(data: {
        name: string;
        email: string;
        password: string;
        role: UserRole;
    }) {
        const hashedPassword = await hashPassword(data.password);
        data.password = hashedPassword;
        const user = await db.user.create({
            data,
        });
        return user;
    }

    async createAttendeeProfile(data: {
        userId: number;
        bio?: string;
        phone?: string;
    }) {
        const profile = await db.attendeeProfile.create({
            data,
        });
        return profile;
    }

    async createOrganizerProfile(data: {
        userId: number;
        organizationName: string;
        contactEmail: string;
    }) {
        const profile = await db.organizerProfile.create({
            data,
        });
        return profile;
    }

    async getUserById(id: number) {
        const user = await db.user.findUnique({
            where: { id },
            include: { attendeeProfile: true, organizerProfile: true },
        });
        if (!user) return null;
        const { password, ...safeUser } = user;
        return safeUser;
    }

    async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const isMatch = await compare(plainTextPassword, hashedPassword);
        return isMatch;
    }

    async verifyEmailToken(token: string) {
        let payload: any;
        try {
            payload = jwt.verify(token, env.EMAIL_SECRET_KEY as string) as { id: number; type: string };
        } catch (err) {
            throw new Error('Invalid or expired verification token');
        }

        if (payload.type !== 'email_verification') {
            throw new Error('Invalid token type');
        }

        const user = await this.getUserById(payload.id);
        if (!user) throw new Error('User not found');

        if (!user.verified) {
            await db.user.update({
                where: { id: payload.id },
                data: { verified: true },
            });
        }

        return user;
    }

    async markUserAsVerified(userId: number) {
        return db.user.update({
            where: { id: userId },
            data: { verified: true },
        });
    }
}


export const authService = new AuthService();