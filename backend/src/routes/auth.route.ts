import { Router } from "express";
import { LoginUser, LogOutUser, RegisterUser } from "../controllers/auth.controller";

const router = Router();

router.post("/register", RegisterUser)
router.post("/login", LoginUser)
router.post("/logout", LogOutUser)

export default router;