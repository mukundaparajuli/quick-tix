import { Router } from "express";
import { getEventAllSeats, releaseSeat } from "../controllers/seat.controller";
import { JwtValidation } from "../middlewares/jwt-validation";

const router = Router();

router.get('/event/:eventId', JwtValidation, getEventAllSeats);
// router.get('/row/:rowId', JwtValidation, getSeatsInRow);
// router.get('/section/:sectionId', JwtValidation, getSeatsInSection);

export default router;
