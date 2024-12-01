import { Router } from "express";
import { verifyPayment } from "../controllers/payment.controller";
import { JwtValidation } from "../middlewares/jwt-validation";

const router = Router();

router.post('/verify-payment', JwtValidation, verifyPayment);


export default router;

