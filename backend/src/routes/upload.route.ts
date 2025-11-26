import { Router } from "express";
import { uploadImage, deleteImage } from "../controllers/upload.controller";
import { upload } from "../middlewares/multer-middleware";

const router = Router();

router.post('/image', upload.single('image'), uploadImage);
router.delete('/image/:publicId', deleteImage);

export default router;