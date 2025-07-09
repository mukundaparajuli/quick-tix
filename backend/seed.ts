import { PrismaClient, SeatStatus, TicketAvailability } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { EventCategory, Role } from "./src/enums";
import * as bcrypt from "bcrypt";
import { createSeedClient } from "@snaplet/seed";

const prisma = new PrismaClient();

const main = async () => {
  const seed = await createSeedClient();

  console.log("Resetting database...");
  // Reset the database
  seed.$resetDatabase();

  console.log("Database is reset now! Seeding data...");

  // Seed organizer
  const organizer = await prisma.user.create({
    data: {
      fullName: "Mukunda Parajuli",
      email: "mukundaparajuli13@gmail.com",
      password: await bcrypt.hash("password", 10),
      username: "mukundaparajuli13",
      role: Role.ORGANIZER,
    },
  });

  console.log("Seeding locations...");
  // Seed locations
  const locations = await prisma.location.createMany({
    data: Array.from({ length: 5 }).map(() => ({
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    })),
  });

  console.log("Seeding venues...");
  // Seed venues
  const venueData = Array.from({ length: 5 }).map((_, index) => ({
    name: faker.company.name(),
    capacity: faker.number.int({ min: 50, max: 500 }),
    amenities: faker.helpers.arrayElements(["WiFi", "Parking", "Restrooms"], 2),
    description: faker.lorem.paragraph(),
    locationId: index + 1,
  }));
  const venues = await prisma.venue.createMany({ data: venueData });

  console.log("Seeding users...");
  // Seed users
  const usersData = await Promise.all(
    Array.from({ length: 10 }).map(async () => ({
      fullName: faker.person.fullName(),
      username: faker.internet.displayName(),
      email: faker.internet.email(),
      password: await bcrypt.hash(faker.internet.password({ length: 12 }), 10),
      role: faker.helpers.arrayElement(["ORGANIZER", "ATTENDEE"]),
      image: faker.image.avatar(),
      verified: faker.datatype.boolean(),
    }))
  );

  const users = await prisma.user.createMany({
    data: usersData,
  });

  console.log("Seeding events...");
  // Seed events
  const events = await prisma.event.createMany({
    data: Array.from({ length: 10 }).map((_, index) => ({
      title: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      category: faker.helpers.arrayElement(
        Object.values(EventCategory)
      ) as EventCategory,
      images: [faker.image.urlPicsumPhotos()],
      tags: faker.lorem.words(5),
      date: faker.date.future(),
      venueId: faker.number.int({ min: 1, max: 5 }),
      price: faker.number.float({ min: 10, max: 100 }),
      availableTickets: faker.number.int({ min: 50, max: 500 }),
      organizerId: organizer.id,
      locationId: faker.number.int({ min: 1, max: 5 }),
    })),
  });

  const ticketType = await prisma.ticketType.createMany({
    data: Array.from({ length: 5 }).map((_, index) => ({
      availability: faker.helpers.arrayElement(
        Object.values(TicketAvailability)
      ) as TicketAvailability,
      currency: faker.word.sample(),
      price: faker.number.float({ min: 10, max: 100 }),
      type: faker.word.sample(),
      eventId: index + 1,
    }))
  })

  console.log("Seeding sections, rows, and seats...");
  // Seed sections, rows, and seats
  const eventIds = await prisma.event.findMany({ select: { id: true } });
  for (const event of eventIds) {
    const sections = await prisma.section.createMany({
      data: ["VIP", "Regular", "Balcony"].map((sectionName) => ({
        name: sectionName,
        eventId: event.id,
      })),
    });

    for (let sectionIndex = 1; sectionIndex <= 3; sectionIndex++) {
      const rows = Array.from({ length: 5 }).map((_, rowIndex) => ({
        rowNumber: rowIndex + 1,
        sectionId: sectionIndex,
      }));
      const createdRows = await prisma.row.createMany({ data: rows });

      for (let rowIndex = 1; rowIndex <= 5; rowIndex++) {
        const seats = Array.from({ length: 10 }).map((_, seatIndex) => ({
          seatId: `Row${rowIndex}-Seat${seatIndex + 1}`,
          rowId: rowIndex,
          status: SeatStatus.AVAILABLE,
          eventId: event.id,
          ticketTypeId: faker.number.int({ min: 1, max: 5 }),
        }));
        await prisma.seat.createMany({ data: seats });
      }
    }
  }

  console.log("Seeding complete!");
};

main()
  .catch((error) => {
    console.error("Error seeding data:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
