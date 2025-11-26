import { Router } from 'express';
import { initializeBooking, getUserBookings } from '../controllers/booking.controller';
import { JwtValidation } from '../middlewares/jwt-validation';

const router = Router();

// Initialize booking with payment
router.post('/initialize', JwtValidation, initializeBooking);

// Get user bookings
router.get('/user', JwtValidation, getUserBookings);

export default router;