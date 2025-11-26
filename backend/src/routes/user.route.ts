import { Router } from "express";
import { JwtValidation } from "../middlewares/jwt-validation";
import { GetProfile, UpdateProfile } from "../controllers/user.controller";
import { upload } from "../middlewares/multer-middleware";

const router = Router();

router.get('/profile', JwtValidation, GetProfile);
router.put('/profile', JwtValidation, upload.single('photo'), UpdateProfile);

export default router;
