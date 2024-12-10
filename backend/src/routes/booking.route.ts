import { Router } from "express";
import { JwtValidation } from "../middlewares/jwt-validation";
import { CancelBooking, GetABookingById, GetAllBookings, GetBookingsForAnUser } from "../controllers/booking.controller";

const router = Router();

router.get('/', JwtValidation, GetBookingsForAnUser)
router.get('/e/:eventId', JwtValidation, GetAllBookings)
router.delete('/:bookingId', JwtValidation, CancelBooking)
router.get('/:bookingId', JwtValidation, GetABookingById)

export default router;