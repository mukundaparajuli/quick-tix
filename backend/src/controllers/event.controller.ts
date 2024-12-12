import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import ApiResponse from "../types/api-response";
import db from "../config/db";
import { EventCategory, Role } from "../enums";
import logger from "../logger";
import { addLocation, addVenue, uploadToCloudinary } from "../services";
import ApiError from "../types/api-error";
import { Agenda, TicketType } from "@prisma/client";



// create event
export const RegisterEvent = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, date, organizerName, organizerEmail, category, location, venue } = req.body;
    const images = req.files;
    const price = Number(req.body.price);
    const totalTickets = Number(req.body.totalTickets);
    const availableTickets = Number(req.body.availableTickets);

    console.log("backend data=", req.body);

    if (!images || images.length == 0) {
        throw new ApiError(404, "Images not available")
    }

    const imagesPath = images?.map((img: any) => (img.path));

    let cloudinaryLinks = [{ url: null }]

    if (images) {
        try {
            cloudinaryLinks = await Promise.all(imagesPath.map((image: string) => uploadToCloudinary(image)));
        } catch (error) {
            throw new ApiError(500, error as string);
        }
    }

    console.log(cloudinaryLinks);
    const imagesUrl = cloudinaryLinks.map((imgUrl) => imgUrl.url);
    console.log(imagesUrl);


    console.log(imagesPath);
    // Check if all fields are present
    if (!title || !description || !date || !venue || !location || !price || !totalTickets || !availableTickets || !organizerName || !organizerEmail) {
        return new ApiResponse(res, 403, "All fields are mandatory to be filled", null, null);
    }
    console.log(req.body);

    // register the location first
    const { address, city, country, state } = JSON.parse(location);
    const loc = await addLocation({ address, city, country, state })
    const locId = loc.id;

    // register the venue here
    let venueId;
    {
        const { name, description, capacity, amenities } = JSON.parse(venue);
        const ven = await addVenue({ name, description, amenities, capacity, locId });
        venueId = ven.id;
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
    const organizer = await db.user.findFirst({
        where: { email: String(organizerEmail) }
    });
    console.log(organizerEmail);
    console.log(organizer);
    if (!organizer) {
        return new ApiResponse(res, 404, "Organizer not found", null, null);
    }

    // Check if the user is an organizer
    if (organizer.role !== Role.ORGANIZER) {
        console.log("error here")
        return new ApiResponse(res, 401, "You are not authorized to organize this event", null, null);
    }

    if (!Object.values(EventCategory).includes(category)) {
        return new ApiResponse(res, 403, "Invalid Category")

    }

    if (!imagesUrl || imagesUrl.length == 0) {
        throw new ApiError(404, "Image url not found!");
    }

    // upload the images to the cloudinary and get the link
    // Create the event
    const newEvent = await db.event.create({
        data: {
            title,
            description,
            category,
            images: imagesUrl,
            date: eventDate,
            venue: { connect: { id: venueId } },
            price,
            totalTickets,
            availableTickets,
            location: { connect: { id: locId } },
            organizer: { connect: { id: organizer.id } },
            ticketTypes: {

            }
        },
        include: {
            organizer: true,
            location: true,
            Section: true

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
                    rowNumber: Number(row.row),
                },
            });

            console.log(row.seats);
            await Promise.all(row.seats.map(async (seat: any) => {
                await db.seat.create({
                    data: {
                        rowId: createdRow.id,
                        seatId: String(seat.id) ?? "12",
                    },
                });
            }));
        }));
    }));

    // Create Ticket Types
    const ticketTypePromises = ticketTypes.map((ticketType: TicketType) =>
        db.ticketType.create({
            data: {
                type: ticketType.type,
                price: ticketType.price,
                currency: ticketType.currency,
                availability: ticketType.availability,
                eventId: newEvent.id,
            },
        })
    );


    // create agendas for the event
    // const agendasPromises = agendas.map((agenda: Agenda) => (
    //     db.agenda.create({
    //         data: {
    //             time: agenda.time,
    //             activity: agenda.activity,
    //             eventId: newEvent.id
    //         }
    //     })
    // ))

    logger.info(`Event registered successfully: ${title} by ${organizerEmail}`);

    return new ApiResponse(res, 200, "Event Registered Successfully", newEvent, null);
});



// Get all events with pagination
export const GetAllEvents = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query; // Default values for page and limit
    const pageNumber = parseInt(page as string, 10); // Convert query params to integers
    const limitNumber = parseInt(limit as string, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
        return new ApiResponse(res, 400, "Invalid pagination parameters!", null, null);
    }

    const skip = (pageNumber - 1) * limitNumber; // Calculate the number of records to skip

    const [events, totalEvents] = await Promise.all([
        db.event.findMany({
            skip,
            take: limitNumber,
            include: {
                location: true,
                venue: true
            }
        }),
        db.event.count(), // Get the total number of events for pagination metadata
    ]);

    if (!events || events.length === 0) {
        return new ApiResponse(res, 404, "No events were found!", null, null);
    }

    const totalPages = Math.ceil(totalEvents / limitNumber);

    return new ApiResponse(
        res,
        200,
        "All the events are here",
        events,
        {
            currentPage: pageNumber,
            totalPages,
            totalEvents,
            limit: limitNumber,
        }
    );
});



// get a event by id
export const GetAnEvent = asyncHandler(async (req: Request, res: Response) => {
    const { eventId } = req.params;

    if (!eventId) {
        return new ApiResponse(res, 404, "event id was not found", null, null);
    }

    console.log(eventId);

    const event = await db.event.findUnique({
        where: {
            id: Number(eventId)
        }, include: {
            location: true,
            Section: {
                include: {
                    rows: {
                        include: {
                            seats: true,
                        }
                    }
                }
            },
            venue: true,
            Seat: true,
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


// get popular events
export const getPopularEvents = asyncHandler(async (req: Request, res: Response) => {
    const events = await db.event.findMany({
        orderBy: {
            bookings: { _count: 'desc' }
        },
        include: {
            location: true,
            venue: true,
        },
        take: 34
    })
    return new ApiResponse(res, 200, "Popular Events are here!", events, null)
})


/**
 * @access private
 * @description This function returns events matching the provided filters (searchTerm, category, date range).
 */


export const SearchEvent = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { searchTerm, category, from, to } = req.query;
        console.log("searchTerm", searchTerm)

        // Initialize an empty filter object
        const filter: any = {};

        // Add filters dynamically based on query parameters
        if (searchTerm && searchTerm !== 'null') {
            filter.title = { contains: searchTerm, mode: 'insensitive' };
        }

        if (category && category !== 'null') {
            filter.category = category;
        }

        if (from && to) {
            filter.date = { gte: new Date(from as string), lte: new Date(to as string) }; // Ensures "date" matches the range
        }

        // Fetch events matching the filter
        const events = await db.event.findMany({
            where: filter,
            include: {
                location: true,
                venue: true,
            }
        });

        return new ApiResponse(res, 200, "Your search result is here!", events, null)
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Server error" });
    }
});
