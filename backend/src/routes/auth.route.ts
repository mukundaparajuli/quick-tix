import { Router } from "express";
import { LoginUser, RegisterUser, VerifyEmail } from "../controllers/auth.controller";

const router = Router();

router.post("/register", RegisterUser)
router.post("/login", LoginUser)
router.get("/verify-email/:verificationToken", VerifyEmail)

export default router;