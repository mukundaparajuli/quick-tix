// types/express/index.d.ts
import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload; // Add user property of type JwtPayload
        }
    }
}

