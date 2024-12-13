import { Router } from "express";
import { verifyPayment } from "../controllers/payment.controller";
import { JwtValidation } from "../middlewares/jwt-validation";
import { esewaPaymentInitialiton } from "../controllers/esewa-payment.controller";

const router = Router();

router.post('/esewa-payment', esewaPaymentInitialiton);
router.post('/verify-payment', JwtValidation, verifyPayment);


export default router;

