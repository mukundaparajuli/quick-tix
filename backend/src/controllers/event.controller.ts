import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import ApiResponse from "../types/api-response";
import db from "../config/db";
import { EventCategory, Role } from "../enums";
import logger from "../logger";


// create event
export const RegisterEvent = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, date, price, totalTickets, availableTickets, organizerName, organizerEmail, category, locationId, venueId, sections } = req.body;

    // Check if all fields are present
    if (!title || !description || !date || !venueId || !locationId || !price || !totalTickets || !availableTickets || !organizerName || !organizerEmail) {
        return new ApiResponse(res, 403, "All fields are mandatory to be filled", null, null);
    }

    // Validate date and number fields
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime()) || eventDate < new Date()) {
        return new ApiResponse(res, 400, "Invalid or past event date.", null, null);
    }

    if (price <= 0 || totalTickets <= 0 || availableTickets < 0) {
        return new ApiResponse(res, 400, "Invalid values for price or tickets.", null, null);
    }

    // Check if organizer exists
    const organizer = await db.user.findUnique({
        where: { email: organizerEmail }
    });

    if (!organizer) {
        return new ApiResponse(res, 404, "Organizer not found", null, null);
    }

    // Check if the user is an organizer
    if (organizer.role !== Role.ORGANIZER) {
        return new ApiResponse(res, 401, "You are not authorized to organize this event", null, null);
    }

    // Create the event
    const newEvent = await db.event.create({
        data: {
            title,
            description,
            category,
            date: eventDate,
            venue: { connect: { id: venueId } },
            price,
            totalTickets,
            availableTickets,
            location: { connect: { id: locationId } },
            organizer: { connect: { id: organizer.id } },
        },
        include: {
            organizer: true,
            location: true,
        },
    });

    // Create sections, rows, and seats in a batch
    await Promise.all(sections.map(async (section: any) => {
        const createdSection = await db.section.create({
            data: {
                eventId: newEvent.id,
                name: section.sectionName,
            },
        });
        await Promise.all(section.rows.map(async (row: any) => {
            const createdRow = await db.row.create({
                data: {
                    sectionId: createdSection.id,
                    rowNumber: row.rowNumber,
                },
            });
            await Promise.all(row.seats.map(async (seat: any) => {
                await db.seat.create({
                    data: {
                        rowId: createdRow.id,
                        seatNumber: seat.seatNumber,
                    },
                });
            }));
        }));
    }));

    logger.info(`Event registered successfully: ${title} by ${organizerEmail}`);

    return new ApiResponse(res, 200, "Event Registered Successfully", newEvent, null);
});





// get all events
export const GetAllEvents = asyncHandler(async (req: Request, res: Response) => {
    const events = await db.event.findMany();

    if (!events || events.length === 0) {
        return new ApiResponse(res, 404, "No events were found!", null, null)
    }

    return new ApiResponse(res, 200, "all the events are here", events, null);
})


// get a event by id
export const GetAnEvent = asyncHandler(async (req: Request, res: Response) => {
    const { eventId } = req.params;

    if (!eventId) {
        return new ApiResponse(res, 404, "event id was not found", null, null);
    }

    const event = await db.event.findUnique({
        where: {
            id: Number(eventId)
        }
    })

    // check if event exists
    if (!event) {
        return new ApiResponse(res, 404, "event does not exist", null, null);
    }

    // now the event exists so return the event

    return new ApiResponse(res, 200, "event is here", event, null);
})



// get event by category
export const GetEventsByCategory = asyncHandler(async (req: Request, res: Response) => {
    const { category } = req.params;

    // check if category is there or not
    if (!category) {
        return new ApiResponse(res, 404, "not category was passed", null, null);
    }

    const normalizedCategory = category.toUpperCase();

    // check if category is among the one from the category enums
    const isCategory = (category: string): boolean => {
        return Object.values(EventCategory).includes(category as EventCategory);
    }
    console.log("is it from the category enum?", isCategory(normalizedCategory))
    if (!isCategory(normalizedCategory as string)) {
        return new ApiResponse(res, 400, "Invalid category", null, null);
    }


    // now we will return all the events from the given category
    const events = await db.event.findMany({
        where: { category: normalizedCategory as EventCategory }
    })

    return new ApiResponse(res, 200, "all the events for this category are here", events, null);
})




// delete an event

export const DeleteAnEvent = asyncHandler(async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const user = req.user;

    if (!eventId) {
        return new ApiResponse(res, 404, "event id was not found", null, null);
    }

    const event = await db.event.findUnique({
        where: {
            id: Number(eventId)
        }
    })

    // check if event exists
    if (!event) {
        return new ApiResponse(res, 404, "event does not exist", null, null);
    }


    // check if user exists
    if (!user) {
        return new ApiResponse(res, 404, "user not found", null, null);
    }

    // the event exists now we will check if the user is an organizer or not
    if (user.role !== 'ORGANIZER') {
        return new ApiResponse(res, 403, "you are not authorized to delete this event", null, null);
    }

    // check if the user is the organizer of this particular event or not
    if (user.id !== event.organizerId) {
        return new ApiResponse(res, 403, "you are not authorized to delete this event", null, null);
    }

    // the event exists and the user is an organizer as well
    const deletedEvent = await db.event.delete({
        where: {
            id: Number(eventId)
        }
    })

    return new ApiResponse(res, 200, "event deleted successfully", deletedEvent, null);
})


// event registration lai complete garnu xa
// flow ma afu clear hune tespaxi teskai anusar banauna khojne


// create booking
// export const RegisterBooking = asyncHandler(async (req: Request, res: Response) => {
//     const { eventId, ticketCounts, seatIds } = req.body;

//     return await db.$transaction(async (tx) => {
//         // Your existing validation code here

//         // Lock seats with timeout
//         const LOCK_TIMEOUT = 15 * 60 * 1000; // 15 minutes
//         const lockExpiry = new Date(Date.now() + LOCK_TIMEOUT);

//         await tx.seat.updateMany({
//             where: { id: { in: seatIds } },
//             data: {
//                 status: SeatStatus.LOCKED,
//                 lockExpiresAt: lockExpiry
//             }
//         });

//         const booking = await tx.booking.create({
//             // Your existing booking creation code
//         });

//         return new ApiResponse(res, 200, "Booking created", booking, null);
//     });
// });
