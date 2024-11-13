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

// Define RegisterEventSchema
const RegisterEventSchema = z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    totalTickets: z.number(),
    organizerName: z.string(),
    organizerEmail: z.string().email("Please provide a valid email"),
    category: z.enum([...Object.values(EventCategory)] as [string, ...string[]]),
    location: LocationSchema,
    venue: VenueSchema,
    sections: z.string()
});

export default RegisterEventSchema;