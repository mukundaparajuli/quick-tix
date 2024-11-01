import jwt, { JwtPayload } from 'jsonwebtoken';

export const generateVerificationToken = (user: JwtPayload) => {
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY as string, { expiresIn: '1h' });
};

