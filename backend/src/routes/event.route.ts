import { Router } from "express";
import { createEvent, getAllEvents, getEventDetails, markAsPublished, searchAndFilterEvents } from "../controllers/event.controller";
import { JwtValidation } from "../middlewares/jwt-validation";

const router = Router();

router.post("/create", JwtValidation, createEvent);
router.post("/:eventId/publish", JwtValidation, markAsPublished);
router.get("/", JwtValidation, getAllEvents);
router.get("/search", JwtValidation, searchAndFilterEvents);
router.get("/:eventId", JwtValidation, getEventDetails);

export default router;