import { Event, Media } from "@/types/event";
import { TicketType } from "@/types/ticket-type";
import { Venue } from "@/types/venue";
import { Section } from "@/types/section";
import { Facility } from "@/types/facility";
import { Seats } from "@/types/seat";

export const normalizeEvent = (eventDetails: any) => {
    console.log(eventDetails)

    // Normalize media
    const media: Media[] = eventDetails?.media?.map((m: any) => ({
        id: m.id,
        url: m.url,
        type: m.type,
        size: m.size,
        altText: m.altText,
        uploadedBy: m.uploadedBy,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
    })) || [];

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
        capacity: eventDetails.capacity,
        media: media,
    };

    // Flatten ticket types
    const ticketTypes: TicketType[] = eventDetails.ticketTypes && eventDetails.ticketTypes.map((tt: any) => ({
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
            // Normalize booking state: prefer camelCase `isBooked`, then snake_case `is_booked`, then availability/status
            isBooked: (seat.isBooked ?? seat.is_booked) ?? (seat.is_available === undefined ? (seat.status === 'BOOKED') : !seat.is_available),
        })),
    }));

    // Venue
    const venue: Venue = eventDetails?.venue && {
        id: eventDetails?.venue?.id,
        name: eventDetails?.venue?.name,
        location: eventDetails?.venue?.location,
        capacity: eventDetails?.venue?.capacity,
        createdAt: eventDetails?.venue?.created_at,
        updatedAt: eventDetails?.venue?.updated_at,
    };

    const seat: Seats[] = eventDetails?.venue?.sections.flatMap((sec: any) =>
        sec.seats.map((seat: any) => ({
            id: seat.id,
            label: seat.label,
            sectionId: sec.id,
            // Provide a boolean that the UI components expect (isBooked)
            isBooked: (seat.isBooked ?? seat.is_booked) ?? (seat.is_available === undefined ? (seat.status === 'BOOKED') : !seat.is_available),
        }))
    );

    return { event, ticketTypes, facilities, venue, sections, seats: seat };
};
