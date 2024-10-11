import { Router } from "express";
import { DeleteAnEvent, GetAllEvents, GetAnEvent, RegisterEvent } from "../controllers/event.controller";
import { JwtValidation } from "../middlewares/jwt-validation";

const router = Router();

router.post('/', RegisterEvent)
router.get('/', GetAllEvents)
router.get('/:eventId', GetAnEvent)
router.delete('/:eventId', JwtValidation, DeleteAnEvent)

export default router;