import { Router } from "express";
import AuthRoutes from "./auth.route";
import EventRoutes from "./event.route";
import TicketTypeRoutes from "./ticket-type.route";
import FacilityRoutes from "./facility.route";

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/events', EventRoutes);
router.use('/ticket-type', TicketTypeRoutes);
router.use('/facility', FacilityRoutes);

export default router;