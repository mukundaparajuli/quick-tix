import { Router } from "express";
import { JwtValidation } from "../middlewares/jwt-validation";
import { GetProfile } from "../controllers/user.controller";

const router = Router();

router.get('/profile', JwtValidation, GetProfile);


export default router;
