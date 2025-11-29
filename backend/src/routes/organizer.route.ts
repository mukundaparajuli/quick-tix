import { Router } from "express";
import {
    getOrganizerEvents,
    getOrganizerBookings,
    getOrganizerStats,
    getOrganizerEarnings,
    updateEvent,
    getBookingDetails,
} from "../controllers/organizer.controller";
import { JwtValidation } from "../middlewares/jwt-validation";

const router = Router();

// Dashboard stats
router.get("/stats", JwtValidation, getOrganizerStats);

// Events
router.get("/events", JwtValidation, getOrganizerEvents);
router.put("/events/:eventId", JwtValidation, updateEvent);

// Bookings
router.get("/bookings", JwtValidation, getOrganizerBookings);
router.get("/bookings/:bookingId", JwtValidation, getBookingDetails);

// Earnings/Wallet
router.get("/earnings", JwtValidation, getOrganizerEarnings);

export default router;
