import { Router } from "express";
import { DeleteAnEvent, GetAllEvents, GetAnEvent, GetEventsByCategory, getPopularEvents, RegisterEvent } from "../controllers/event.controller";
import { JwtValidation } from "../middlewares/jwt-validation";

const router = Router();

router.post('/', JwtValidation, RegisterEvent)
router.get('/', JwtValidation, GetAllEvents)
router.get('/:eventId', JwtValidation, GetAnEvent)
router.get('/category/:category', JwtValidation, GetEventsByCategory)
router.delete('/:eventId', JwtValidation, DeleteAnEvent)
router.get('popular-events', getPopularEvents);

export default router;