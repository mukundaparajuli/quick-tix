import { Router } from "express";
import { DeleteAnEvent, GetAllEvents, GetAnEvent, GetEventsByCategory, getPopularEvents, RegisterEvent, SearchEvent } from "../controllers/event.controller";
import { JwtValidation } from "../middlewares/jwt-validation";
import { upload } from "../middlewares/multer-middleware"

const router = Router();

router.get('/popular-events', getPopularEvents);
router.get('/search/', SearchEvent)
router.post('/', JwtValidation, upload.array('images'), RegisterEvent)
router.get('/', JwtValidation, GetAllEvents)
router.get('/:eventId', JwtValidation, GetAnEvent)
router.get('/category/:category', JwtValidation, GetEventsByCategory)
router.delete('/:eventId', JwtValidation, DeleteAnEvent)

export default router;