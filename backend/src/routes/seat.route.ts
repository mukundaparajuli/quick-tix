import { Router } from "express";
import { createSeats } from "../controllers/seat.controller";
import { JwtValidation } from "../middlewares/jwt-validation";

const router = Router();

router.post("/", JwtValidation, createSeats);

export default router;
