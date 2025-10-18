import { Event } from "@/types/event";
import { TicketType } from "@/types/ticket-type";
import { Venue } from "@/types/venue";
import { Section } from "@/types/section";
import { Facility } from "@/types/facility";

export const normalizeEvent = (eventDetails: any) => {
    console.log(eventDetails)
    const event: Event = {
        id: eventDetails.id,
        title: eventDetails.title,
        description: eventDetails.description,
        date: eventDetails.date,
        location: eventDetails.location,
        organizerId: eventDetails.organizer_id,
        isPublished: eventDetails.is_published,
        venueId: eventDetails.venue_id,
        createdAt: eventDetails.created_at,
        updatedAt: eventDetails.updated_at,
    };

    // Flatten ticket types
    const ticketTypes: TicketType[] = eventDetails?.ticketTypes.map((tt: any) => ({
        id: tt.id,
        name: tt.name,
        price: tt.price,
        eventId: tt.event_id,
        sold: tt.sold,
        createdAt: tt.created_at,
        updatedAt: tt.updated_at,
    }));

    // Flatten facilities
    const facilities: Facility[] = eventDetails?.ticketTypes.flatMap((tt: any) =>
        tt.facilities.map((f: any) => ({
            id: f.id,
            name: f.name,
            description: f.description,
            ticketTypeId: tt.id,
        }))
    );

    // Flatten sections with seat info (optional, include if needed)
    const sections: Section[] = eventDetails?.venue?.sections.map((sec: any) => ({
        id: sec.id,
        name: sec.name,
        capacity: sec.capacity,
        venueId: eventDetails.venue.id,
        seats: sec.seats.map((seat: any) => ({
            id: seat.id,
            number: seat.number,
            status: seat.status,
            sectionId: sec.id,
        })),
    }));

    // Venue
    const venue: Venue = {
        id: eventDetails?.venue?.id,
        name: eventDetails?.venue?.name,
        location: eventDetails?.venue?.location,
        capacity: eventDetails?.venue?.capacity,
        createdAt: eventDetails?.venue?.created_at,
        updatedAt: eventDetails?.venue?.updated_at,
    };

    return { event, ticketTypes, facilities, venue, sections };
};
