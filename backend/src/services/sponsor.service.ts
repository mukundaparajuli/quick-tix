import db from "../config/db";
import ApiError from "../types/api-error";

type Sponsor = {
    name: string;
    website: string;
}

export class SponsorService {
    async createSponsors(eventId: number, sponsors: Sponsor[]) {
        if (!eventId) {
            throw new ApiError(400, "Event id is requred to create an sponsor       ")
        }

        let createdSponsors = [];

        for (const sponsor of sponsors) {
            const createdSponsor = await db.sponsor.create({
                data: {
                    name: sponsor.name,
                    website: sponsor.website,
                    eventId: eventId
                }
            });

            createdSponsors.push(createdSponsor)
        }

        return createdSponsors;
    }
}

export const sponsorService = new SponsorService();