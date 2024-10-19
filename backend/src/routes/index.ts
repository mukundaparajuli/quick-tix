import { Router } from "express";
import UserRoutes from "./user.route";
import AuthRoutes from "./auth.route";
import EventRoutes from "./event.route";
import BookingRoutes from "./booking.route";
import SeatRoutes from "./seat.route";
import VenueRoutes from "./venue.route";
import PaymentRoutes from "./payment.route";

const router = Router();

router.use('/user', UserRoutes);
router.use('/auth', AuthRoutes);
router.use('/event', EventRoutes);
router.use('/booking', BookingRoutes);
router.use('/seat', SeatRoutes);
router.use('/venue', VenueRoutes);
router.use('/payment', PaymentRoutes);


export default router;