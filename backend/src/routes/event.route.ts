import { Router } from "express";
import { createEvent, getAllEvents, markAsPublished } from "../controllers/event.controller";
import { JwtValidation } from "../middlewares/jwt-validation";

const router = Router();

router.post("/create", JwtValidation, createEvent);
router.post("/:eventId/publish", JwtValidation, markAsPublished);
router.get("/", JwtValidation, getAllEvents);

export default router;