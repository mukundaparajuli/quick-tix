import { z } from "zod";
import { EventCategory } from "../enums/event-category.enum";

// Define LocationSchema
const LocationSchema = z.object({
    address: z.string(),
    city: z.string(),
    country: z.string(),
    state: z.string()
});

// Define VenueSchema
const VenueSchema = z.object({
    name: z.string(),
    description: z.string(),
    capacity: z.number(),
    amenities: z.array(z.string())
});



// Define the Seat schema
const SeatSchema = z.object({
    id: z.string(), // Seat ID should be a string
    status: z.enum(["available", "reserved", "sold"]), // Status can be one of these values
});

// Define the Row schema
const RowSchema = z.object({
    row: z.string(), // Row number should be a string
    seats: z.array(SeatSchema), // Seats should be an array of Seat objects
});

// Define the Section schema
export const SectionSchema = z.object({
    name: z.string(), // Section name should be a string
    rows: z.array(RowSchema), // Rows should be an array of Row objects
});




// Define RegisterEventSchema
const RegisterEventSchema = z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    totalTickets: z.number(),
    availableTickets: z.number(),
    price: z.number(),
    organizerName: z.string(),
    organizerEmail: z.string().email("Please provide a valid email"),
    category: z.enum([...Object.values(EventCategory)] as [string, ...string[]]).optional(),
    location: LocationSchema,
    venue: VenueSchema,
});


export default RegisterEventSchema;

