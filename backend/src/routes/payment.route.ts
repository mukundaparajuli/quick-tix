import { Router } from "express";
import { makePayment } from "../controllers/payment.controller";
import { JwtValidation } from "../middlewares/jwt-validation";

const router = Router();

router.post('/', JwtValidation, makePayment);


export default router;

