import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../types/types';

export const generateVerificationToken = (user: User) => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: '1d' }
    );
};

