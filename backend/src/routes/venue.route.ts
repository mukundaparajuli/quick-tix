import { Router } from "express";
import { createVenue, getAllVenues, getVenueById, updateVenue, deleteVenue, getEventsByVenueId } from "../controllers/venue.controller";
import { JwtValidation } from "../middlewares/jwt-validation";

const router = Router();

router.post('/', JwtValidation, createVenue);
router.get('/', JwtValidation, getAllVenues);
router.get('/:id', JwtValidation, getVenueById);
router.put('/:id', JwtValidation, updateVenue);
router.delete('/:id', JwtValidation, deleteVenue);
router.get('/:id/events', JwtValidation, getEventsByVenueId);

export default router;
