import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env.config';

export const generateEmailVerificationToken = (user: any) => {
    return jwt.sign(
        { id: user.id, type: 'email_verification' },
        env.EMAIL_SECRET_KEY as string,
        { expiresIn: '1h' }
    );
};
export const generateJwtToken = (user: any) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        env.JWT_SECRET_KEY as string,
        { expiresIn: '7d' }
    );
};
