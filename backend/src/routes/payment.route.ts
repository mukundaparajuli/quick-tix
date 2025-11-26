import { Router } from 'express';
import {
    khaltiPaymentSuccess,
    esewaPaymentSuccess,
    paymentFailure,
    getBookingStatus,
    cancelBooking
} from '../controllers/payment.controller';
import { JwtValidation } from '../middlewares/jwt-validation';

const router = Router();

// Payment success callbacks (no auth required for gateway callbacks)
router.get('/success/khalti', khaltiPaymentSuccess);
router.get('/success/esewa', esewaPaymentSuccess);
router.post('/success/esewa', esewaPaymentSuccess);

// Payment failure callback (no auth required)
router.get('/failure', paymentFailure);

// Booking management endpoints (auth required)
router.get('/booking/:bookingId/status', JwtValidation, getBookingStatus);
router.delete('/booking/:bookingId', JwtValidation, cancelBooking);

export default router;