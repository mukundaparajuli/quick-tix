import { PrismaClient, Role, EventCategory, TicketAvailability, SeatStatus, DiscountType, BookingStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function seed() {
  try {
    console.log('Starting database seeding...');

    // Clear existing data (optional, comment out if you don't want to clear)
    await prisma.payment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.seat.deleteMany();
    await prisma.ticketType.deleteMany();
    await prisma.promocode.deleteMany();
    await prisma.sponsor.deleteMany();
    await prisma.agenda.deleteMany();
    await prisma.agendas.deleteMany();
    await prisma.event.deleteMany();
    await prisma.venue.deleteMany();
    await prisma.location.deleteMany();
    await prisma.organizerProfile.deleteMany();
    await prisma.user.deleteMany();

    // Seed Location (for "Comedy Night")
    const location = await prisma.location.create({
      data: {
        address: '456 Party Ave',
        city: 'Pokhara',
        state: 'Gandaki',
        country: 'Nepal',
        latitude: 28.2096,
        longitude: 83.9856,
        createdAt: new Date('2025-07-14T09:42:41.287Z'),
        updatedAt: new Date('2025-07-14T09:42:41.287Z'),
      },
    });

    // Seed Venue (for "Comedy Night")
    const venue = await prisma.venue.create({
      data: {
        name: 'Pokhara Arena',
        capacity: 300,
        amenities: ['Parking', 'Sound System'],
        description: 'A cozy arena in Pokhara.',
        locationId: location.id,
        createdAt: new Date('2025-07-14T09:42:44.747Z'),
        updatedAt: new Date('2025-07-14T09:42:44.747Z'),
      },
    });

    // Seed Users (Organizer and Attendee)
    const users = await Promise.all([
      // Organizer
      prisma.user.create({
        data: {
          fullName: 'Event Organizer',
          username: 'organizer1',
          email: 'organizer1@example.com',
          password: await hashPassword('organizer123'),
          role: Role.ORGANIZER,
          verified: true,
          createdAt: new Date('2025-07-14T09:42:48.000Z'),
          updatedAt: new Date('2025-07-14T09:42:48.000Z'),
          createdBy: 1,
          locationId: location.id,
        },
      }),
      // Attendee
      prisma.user.create({
        data: {
          fullName: 'Jane Doe',
          username: 'attendee1',
          email: 'attendee1@example.com',
          password: await hashPassword('attendee123'),
          role: Role.ATTENDEE,
          verified: true,
          createdAt: new Date('2025-07-14T09:42:50.000Z'),
          updatedAt: new Date('2025-07-14T09:42:50.000Z'),
          createdBy: 1,
          locationId: location.id,
        },
      }),
    ]);

    // Seed Organizer Profile
    const organizerProfile = await prisma.organizerProfile.create({
      data: {
        businessName: 'EventMaster Inc.',
        isKycVerified: true,
        userId: users[0].id, // Link to organizer user
        createdAt: new Date('2025-07-14T09:42:48.660Z'),
        updatedAt: new Date('2025-07-14T09:42:48.660Z'),
      },
    });

    // Seed Agendas (empty for "Comedy Night", but create an Agendas record)
    const agendas = await prisma.agendas.create({
      data: {
        createdAt: new Date('2025-07-14T09:42:49.000Z'),
        updatedAt: new Date('2025-07-14T09:42:49.000Z'),
      },
    });

    // Seed Event ("Comedy Night")
    const event = await prisma.event.create({
      data: {
        title: 'Comedy Night',
        description: 'A night full of laughter with top comedians.',
        category: EventCategory.STANDUP_COMEDY,
        images: ['https://example.com/image2.jpg'],
        tags: ['comedy', 'standup', 'fun'],
        date: new Date('2025-09-15T19:00:00.000Z'),
        agendasId: agendas.id,
        organizerProfileId: organizerProfile.id,
        venueId: venue.id,
        locationId: location.id,
        createdAt: new Date('2025-07-14T09:42:49.302Z'),
        updatedAt: new Date('2025-07-14T09:42:49.302Z'),
        attendees: {
          connect: [{ id: users[1].id }], // Connect attendee
        },
      },
    });

    // Seed Sponsor
    await prisma.sponsor.create({
      data: {
        name: 'BrandY',
        website: 'https://brandy.com',
        eventId: event.id,
        createdAt: new Date('2025-07-14T09:42:53.421Z'),
        updatedAt: new Date('2025-07-14T09:42:53.421Z'),
      },
    });

    // Seed Ticket Types (since ticketTypes was empty, adding sample data)
    const ticketType = await prisma.ticketType.create({
      data: {
        eventId: event.id,
        name: 'General Admission',
        price: 15.0,
        totalQuantity: 100,
        availableQuantity: 90,
        features: { description: 'Standard seating' },
        availability: TicketAvailability.AVAILABLE,
        createdAt: new Date('2025-07-14T09:42:55.000Z'),
        updatedAt: new Date('2025-07-14T09:42:55.000Z'),
      },
    });

    // Seed Seats
    const seat = await prisma.seat.create({
      data: {
        venueId: venue.id,
        ticketTypeId: ticketType.id,
        seatNumber: 'A1',
        row: 'A',
        section: 'Main',
        status: SeatStatus.AVAILABLE,
        createdAt: new Date('2025-07-14T09:42:56.000Z'),
        updatedAt: new Date('2025-07-14T09:42:56.000Z'),
      },
    });

    // Seed Promocode
    const promocode = await prisma.promocode.create({
      data: {
        code: 'COMEDY10',
        discount: 10.0,
        discountType: DiscountType.PERCENTAGE,
        eventId: event.id,
        maxUses: 50,
        usedCount: 0,
        validFrom: new Date('2025-07-14T00:00:00.000Z'),
        validUntil: new Date('2025-09-30T23:59:59.999Z'),
        createdAt: new Date('2025-07-14T09:42:57.000Z'),
        updatedAt: new Date('2025-07-14T09:42:57.000Z'),
      },
    });

    // Seed Booking
    const booking = await prisma.booking.create({
      data: {
        eventId: event.id,
        userId: users[1].id,
        ticketTypeId: ticketType.id,
        ticketCount: 2,
        totalPrice: 27.0, // 15 * 2 * 0.9 (after 10% discount)
        promocodeId: promocode.id,
        status: BookingStatus.CONFIRMED,
        createdAt: new Date('2025-07-14T09:42:58.000Z'),
        updatedAt: new Date('2025-07-14T09:42:58.000Z'),
      },
    });

    // Update Seat to associate with Booking
    await prisma.seat.update({
      where: { id: seat.id },
      data: {
        bookingId: booking.id,
        status: SeatStatus.BOOKED,
      },
    });

    // Seed Payment
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: 27.0,
        paymentProvider: PaymentMethod.ESEWA,
        paymentStatus: PaymentStatus.SUCCESSFUL,
        transactionId: 'TXN123456',
        paymentResponse: { status: 'success', provider: 'esewa' },
        createdAt: new Date('2025-07-14T09:42:59.000Z'),
        updatedAt: new Date('2025-07-14T09:42:59.000Z'),
      },
    });

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});