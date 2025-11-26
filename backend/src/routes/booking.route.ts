import { Router } from 'express';
import { initializeBooking, getUserBookings, getBookingById } from '../controllers/booking.controller';
import { JwtValidation } from '../middlewares/jwt-validation';

const router = Router();

router.post('/initialize', JwtValidation, initializeBooking);
router.get('/user', JwtValidation, getUserBookings);
router.get('/:id', JwtValidation, getBookingById);

export default router;