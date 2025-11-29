import { Router } from "express";
import { createSeats, getCapacitySummary, checkSeatAvailability } from "../controllers/seat.controller";
import { JwtValidation } from "../middlewares/jwt-validation";

const router = Router();

router.post("/", JwtValidation, createSeats);
router.get("/capacity/:venueId", JwtValidation, getCapacitySummary);
router.get("/availability/:sectionId", JwtValidation, checkSeatAvailability);

export default router;
