import { Router } from "express";
import { JwtValidation } from "../middlewares/jwt-validation";
import { createFacility } from "../controllers/facility.controller";

const router = Router();

router.post("/create", JwtValidation, createFacility);

export default router;