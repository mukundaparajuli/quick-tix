import { Router } from "express";
import { JwtValidation } from "../middlewares/jwt-validation";
import { GetProfile, UpdateProfile } from "../controllers/user.controller";

const router = Router();

router.get('/profile', JwtValidation, GetProfile);
router.put('/profile', JwtValidation, UpdateProfile);

export default router;
