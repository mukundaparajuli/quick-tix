import { Router } from "express";
import { JwtValidation } from "../middlewares/jwt-validation";
import { addLocation } from "../controllers/location.controller";

const router = Router();

router.post('/', JwtValidation, addLocation);

export default router;