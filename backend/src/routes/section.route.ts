import { Router } from "express";
import { JwtValidation } from "../middlewares/jwt-validation";
import { createSection } from "../controllers/section.controller";

const router = Router();

router.post('/create', JwtValidation, createSection);


export default router;
