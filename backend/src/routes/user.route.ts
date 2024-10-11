import { Request, Response, Router } from "express";
import { getAllUsers, getUserById } from "../controllers/user.controller";

const router = Router();

router.get("/", getAllUsers);
router.get("/:userId", getUserById);

export default router;