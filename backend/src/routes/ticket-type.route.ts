import { Router } from "express";
import { JwtValidation } from "../middlewares/jwt-validation";
import { createTicketType } from "../controllers/ticket-types.controller";

const router = Router();

router.post("/create", JwtValidation, createTicketType);

export default router;