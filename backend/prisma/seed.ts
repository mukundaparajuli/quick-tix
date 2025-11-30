import { PrismaClient, UserRole, BookingStatus, PaymentStatus, PaymentMethod, MediaType } from '../generated/prisma';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@quicktix.com',
            name: 'Admin User',
            password: '$2b$10$hashedpassword', // In real app, hash properly
            role: UserRole.ADMIN,
            verified: true,
        },
    });

    // Create organizer user
    const organizerUser = await prisma.user.create({
        data: {
            email: 'organizer@quicktix.com',
            name: 'Event Organizer',
            password: '$2b$10$hashedpassword',
            role: UserRole.ORGANIZER,
            verified: true,
        },
    });

    // Create organizer profile
    const organizerProfile = await prisma.organizerProfile.create({
        data: {
            userId: organizerUser.id,
            organizationName: 'Quick Events Co.',
            bio: 'Professional event organizers',
            phone: '+977-1234567890',
            website: 'https://quickevents.com',
            contactEmail: 'contact@quickevents.com',
            kycVerified: true,
        },
    });

    // Create attendee users
    const attendeeUsers = [];
    for (let i = 0; i < 5; i++) {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                name: faker.person.fullName(),
                password: '$2b$10$hashedpassword',
                role: UserRole.ATTENDEE,
                verified: true,
            },
        });
        attendeeUsers.push(user);
    }

    // Create attendee profiles
    const attendeeProfiles = [];
    for (const user of attendeeUsers) {
        const profile = await prisma.attendeeProfile.create({
            data: {
                userId: user.id,
                bio: faker.lorem.sentence(),
                phone: faker.phone.number(),
            },
        });
        attendeeProfiles.push(profile);
    }

    // Create venues
    const venues = [];
    for (let i = 0; i < 3; i++) {
        const venue = await prisma.venue.create({
            data: {
                name: faker.company.name() + ' Hall',
                location: faker.location.streetAddress(),
                capacity: faker.number.int({ min: 100, max: 1000 }),
            },
        });
        venues.push(venue);
    }

    // Create sections for each venue
    const sections = [];
    for (const venue of venues) {
        for (let i = 0; i < 3; i++) {
            const section = await prisma.section.create({
                data: {
                    name: `Section ${String.fromCharCode(65 + i)}`, // A, B, C
                    capacity: faker.number.int({ min: 50, max: 200 }),
                    venueId: venue.id,
                },
            });
            sections.push(section);
        }
    }

    // Create seats for each section
    const seats = [];
    for (const section of sections) {
        for (let i = 1; i <= section.capacity!; i++) {
            const seat = await prisma.seat.create({
                data: {
                    label: `${i.toString().padStart(3, '0')}`,
                    sectionId: section.id,
                },
            });
            seats.push(seat);
        }
    }

    // Create events
    const events = [];
    for (let i = 0; i < 5; i++) {
        const event = await prisma.event.create({
            data: {
                title: faker.lorem.words(3),
                description: faker.lorem.paragraph(),
                date: faker.date.future(),
                location: faker.location.city(),
                capacity: faker.number.int({ min: 200, max: 800 }),
                organizerId: organizerProfile.id,
                venueId: venues[i % venues.length].id,
                isPublished: true,
            },
        });
        events.push(event);
    }

    // Create ticket types for each event
    const ticketTypes = [];
    for (const event of events) {
        const vipTicket = await prisma.ticketType.create({
            data: {
                name: 'VIP',
                description: 'Premium seating with exclusive access',
                price: faker.number.float({ min: 5000, max: 10000 }),
                capacity: faker.number.int({ min: 20, max: 50 }),
                eventId: event.id,
            },
        });
        ticketTypes.push(vipTicket);

        const regularTicket = await prisma.ticketType.create({
            data: {
                name: 'Regular',
                description: 'Standard seating',
                price: faker.number.float({ min: 1000, max: 3000 }),
                capacity: faker.number.int({ min: 100, max: 200 }),
                eventId: event.id,
            },
        });
        ticketTypes.push(regularTicket);
    }

    // Create facilities for ticket types
    for (const ticketType of ticketTypes) {
        if (ticketType.name === 'VIP') {
            await prisma.facility.create({
                data: {
                    name: 'VIP Lounge Access',
                    description: 'Exclusive lounge with complimentary drinks',
                    ticketTypeId: ticketType.id,
                },
            });
            await prisma.facility.create({
                data: {
                    name: 'Meet & Greet',
                    description: 'Meet the performers after the event',
                    ticketTypeId: ticketType.id,
                },
            });
        }
    }

    // Create some bookings
    const usedCombinations = new Set<string>();
    for (let i = 0; i < 10; i++) {
        let event: typeof events[0];
        let attendee: typeof attendeeProfiles[0];
        let combination: string;

        // Find a unique attendee-event combination
        do {
            event = events[faker.number.int({ min: 0, max: events.length - 1 })];
            attendee = attendeeProfiles[faker.number.int({ min: 0, max: attendeeProfiles.length - 1 })];
            combination = `${event.id}-${attendee.id}`;
        } while (usedCombinations.has(combination));

        usedCombinations.add(combination);

        const ticketType = ticketTypes.find(tt => tt.eventId === event.id && tt.name === 'Regular')!;

        const booking = await prisma.booking.create({
            data: {
                eventId: event.id,
                attendeeId: attendee.id,
                status: BookingStatus.CONFIRMED,
                totalPrice: ticketType.price,
                paymentStatus: PaymentStatus.PAID,
            },
        });

        // Create ticket for booking
        await prisma.ticket.create({
            data: {
                typeId: ticketType.id,
                quantity: 1,
                totalPrice: ticketType.price,
                bookingId: booking.id,
            },
        });

        // Create payment for booking
        await prisma.payment.create({
            data: {
                amount: ticketType.price,
                bookingId: booking.id,
                status: PaymentStatus.PAID,
                method: PaymentMethod.CARD,
                transactionId: faker.string.uuid(),
                paidAt: new Date(),
            },
        });
    }

    // Create some media
    await prisma.media.create({
        data: {
            url: faker.image.url(),
            type: MediaType.IMAGE,
            size: faker.number.int({ min: 100000, max: 5000000 }),
            altText: 'Event banner',
            uploadedBy: organizerUser.id,
        },
    });

    console.log('✅ Database seeding completed successfully!');
    console.log(`Created:`);
    console.log(`- ${1} admin user`);
    console.log(`- ${1} organizer`);
    console.log(`- ${attendeeUsers.length} attendees`);
    console.log(`- ${venues.length} venues`);
    console.log(`- ${sections.length} sections`);
    console.log(`- ${seats.length} seats`);
    console.log(`- ${events.length} events`);
    console.log(`- ${ticketTypes.length} ticket types`);
    console.log(`- ${10} bookings`);
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });