import { Router } from "express";
import { createSeats, getCapacitySummary, checkSeatAvailability, reserveSeat, releaseSeat } from "../controllers/seat.controller";
import { JwtValidation } from "../middlewares/jwt-validation";

const router = Router();

router.post("/", JwtValidation, createSeats);
router.get("/capacity/:venueId", JwtValidation, getCapacitySummary);
router.get("/availability/:sectionId", JwtValidation, checkSeatAvailability);
router.post("/reserve", JwtValidation, reserveSeat);
router.delete("/reserve/:seatId", JwtValidation, releaseSeat);

export default router;
