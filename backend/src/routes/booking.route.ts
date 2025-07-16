import { Router } from "express";
import { JwtValidation } from "../middlewares/jwt-validation";
import { ConfirmBooking, GetBookingsForAnEvent, GetBookingsForAnUser, InitializeBooking } from "../controllers/booking.controller";

const router = Router();

router.post("/reserve", JwtValidation, InitializeBooking);
router.post("/confirm/:bookingId", JwtValidation, ConfirmBooking);
router.post("/event/:eventId", JwtValidation, GetBookingsForAnEvent);
router.post("/user/:userId", JwtValidation, GetBookingsForAnUser);
router.post("/:bookingId", JwtValidation, GetBookingsForAnUser);
export default router;