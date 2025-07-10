import { Router } from "express";
// import { DeleteAnEvent, GetAllEvents, GetAnEvent, GetEventsByCategory, getPopularEvents, RegisterEvent, SearchEvent } from "../controllers/event.controller";
import { JwtValidation } from "../middlewares/jwt-validation";
import { upload } from "../middlewares/multer-middleware"
import { CreateEvent, DeleteEvent, GetAllEvents, GetEventById, GetEventsByCategory, SearchEvent, UpdateEvent } from "../controllers/event.controller";

const router = Router();

router.get('/search/', SearchEvent)
router.post('/create-event', JwtValidation, upload.array('images'), CreateEvent)
router.patch('update-event', JwtValidation, UpdateEvent);
router.get('/all-events', JwtValidation, GetAllEvents)
router.get('/:eventId', JwtValidation, GetEventById)
router.get('/:category', JwtValidation, GetEventsByCategory)
router.delete('/:eventId', JwtValidation, DeleteEvent)

export default router;