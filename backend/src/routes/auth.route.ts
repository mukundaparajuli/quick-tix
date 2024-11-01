import { Router } from "express";
import { LoginUser, LogOutUser, RegisterUser, VerifyEmail } from "../controllers/auth.controller";

const router = Router();

router.post("/register", RegisterUser)
router.post("/login", LoginUser)
router.post("/logout", LogOutUser)
router.get("/verify-email/:verificationToken", VerifyEmail)

export default router;