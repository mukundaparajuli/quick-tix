import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env.config';

export const generateVerificationToken = (user: any) => {
    return jwt.sign(
        { id: user.id },
        env.JWT_SECRET_KEY as string,
        { expiresIn: '1d' }
    );
};

