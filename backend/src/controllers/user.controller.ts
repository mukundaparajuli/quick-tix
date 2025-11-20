import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import ApiError from "../types/api-error";
import { userService } from "../services/user.service";
import ApiResponse from "../types/api-response";

export const GetProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const userProfile = await userService.getUserById(userId);
    if (!userProfile) {
        throw new ApiError(404, "User not found");
    }

    return new ApiResponse(res, 200, "User profile fetched successfully", userProfile);
});

export const UpdateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const updateData = req.body;
    console.log("Update Data in Controller:", updateData);
    if (req.file) {
        updateData.photo = req.file.path;
    }

    const updatedProfile = await userService.updateUserProfile(userId, updateData);
    if (!updatedProfile) {
        throw new ApiError(404, "User not found or update failed");
    }

    return new ApiResponse(res, 200, "User profile updated successfully", updatedProfile);
});