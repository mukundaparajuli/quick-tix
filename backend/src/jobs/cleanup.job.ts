import { schedule } from "node-cron";
import { bookingService } from "../services/booking.service";

export function startCleanupJob() {
    schedule("*/1 * * * *", async () => {
        await bookingService.releaseExpiredReservations();
        console.log("Released expired reservations");
    });
}