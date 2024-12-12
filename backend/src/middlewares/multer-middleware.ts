
import { Request } from "express";
import multer from "multer";
import path from "path";
import ApiError from "../types/api-error";

const storage = multer.diskStorage({
    destination: function (req: Request, file: any, cb: Function) {
        const destinationPath = path.join(__dirname, '..', 'uploads');
        cb(null, destinationPath);
    },
    filename: function (req: Request, file: any, cb: Function) {
        const newFileName: string = `${Date.now()}-${file.originalname}`;
        cb(null, newFileName);
    }
});

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
