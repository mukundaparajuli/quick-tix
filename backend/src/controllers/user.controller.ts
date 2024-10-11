import { Request, Response } from "express";
import db from "../config/db";
import ApiResponse from "../types/api-response";
import asyncHandler from "../utils/async-handler";

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await db.user.findMany();

    if (!users || users.length < 1) {
        return new ApiResponse(res, 404, "No users were found", null, null);
    }

    return new ApiResponse(res, 200, "Got all the users", users, null)
})

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
        return new ApiResponse(res, 404, "User Id not found", null, null);
    }

    const user = await db.user.findUnique({
        where: {
            id: Number(userId),
        }
    })

    if (!user) {
        return new ApiResponse(res, 404, "User Not Found!", null, null);
    }

    return new ApiResponse(res, 200, "User info is here", user, null);
})