import { Router } from "express";
import UserRoutes from "./user.route"

const router = Router();

router.use('/userRoute', UserRoutes);

export default router;