import { Router } from 'express';
import { initializeBooking } from '../controllers/booking.controller';
import { JwtValidation } from '../middlewares/jwt-validation';

const router = Router();

// Initialize booking with payment
router.post('/initialize', JwtValidation, initializeBooking);

export default router;