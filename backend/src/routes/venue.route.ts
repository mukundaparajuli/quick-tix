import { Router } from "express";
import { addVenue, getAllVenues, getVenueById, updateVenue, deleteVenue } from "../controllers/venue.controller";
import { JwtValidation } from "../middlewares/jwt-validation";

const router = Router();

router.post('/', JwtValidation, addVenue);
router.get('/', JwtValidation, getAllVenues);
router.get('/:id', JwtValidation, getVenueById);
router.put('/:id', JwtValidation, updateVenue);
router.delete('/:id', JwtValidation, deleteVenue);

export default router;
