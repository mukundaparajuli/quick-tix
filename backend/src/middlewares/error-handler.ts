import { Request, Response, NextFunction } from 'express';
import ApiError from '../types/api-error';

// Middleware to handle errors
const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: err.message || "Internal server error",
        data: err.data || null,
        errors: err.errors || null
    });
};

export default errorHandler;