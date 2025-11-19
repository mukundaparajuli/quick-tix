import { Router } from "express";
import AuthRoutes from "./auth.route";
import EventRoutes from "./event.route";
import TicketTypeRoutes from "./ticket-type.route";
import FacilityRoutes from "./facility.route";
import VenueRoutes from "./venue.route";
import SectionRoutes from "./section.route";
import SeatRoutes from "./seat.route";
import UserRoutes from "./user.route";

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/events', EventRoutes);
router.use('/ticket-type', TicketTypeRoutes);
router.use('/facility', FacilityRoutes);
router.use('/venue', VenueRoutes);
router.use('/section', SectionRoutes);
router.use('/seats', SeatRoutes);
router.use('/users', UserRoutes);

export default router;