import { Router } from "express";
import { JwtValidation } from "../middlewares/jwt-validation";
import { CancelBooking, GetABookingById, GetAllBookings, GetBookingsForAUser, RegisterBooking } from "../controllers/booking.controller";

const router = Router();

router.post('/', JwtValidation, RegisterBooking)
router.get('/', JwtValidation, GetBookingsForAUser)
router.get('/:eventId', JwtValidation, GetAllBookings)
router.delete('/:bookingId', JwtValidation, CancelBooking)
router.get('/:bookingId', JwtValidation, GetABookingById)

export default router;