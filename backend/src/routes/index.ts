import { Router } from "express";
import UserRoutes from "./user.route";
import AuthRoutes from "./auth.route";
import EventRoutes from "./event.route";

const router = Router();

router.use('/user', UserRoutes);
router.use('/auth', AuthRoutes);
router.use('/event', EventRoutes);

export default router;