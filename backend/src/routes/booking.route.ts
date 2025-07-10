import { Router } from "express";
import { JwtValidation } from "../middlewares/jwt-validation";
import { ConfirmBooking, InitializeBooking } from "../controllers/booking.controller";

const router = Router();

// router.get('/', JwtValidation, GetBookingsForAnUser)
// router.get('/e/:eventId', JwtValidation, GetAllBookings)
// router.delete('/:bookingId', JwtValidation, CancelBooking)
// router.get('/:bookingId', JwtValidation, GetABookingById)


router.post("/reserve", JwtValidation, InitializeBooking);
router.post("/confirm/:bookingId", JwtValidation, ConfirmBooking);
export default router;