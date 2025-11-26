
import { Request } from "express";
import multer from "multer";
import path from "path";
import ApiError from "../types/api-error";

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: any, cb: Function) => {
    if (!file.mimetype.startsWith("image")) {
        return cb(
            new ApiError(
                400,
                "Only image files are allowed",
            )
        );
    }
    return cb(null, true);
}

export const upload = multer({
    storage, limits: { fileSize: 50 * 1024 * 1024 }, fileFilter
})
