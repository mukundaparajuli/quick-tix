import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import routes from "./routes/index";
import errorHandler from "./middlewares/error-handler";
import cookieParser from 'cookie-parser';
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./sockets";
import { env } from "./config/env.config";
import cron from 'node-cron';
import { bookingService } from "./services/booking.service";

dotenv.config();

const app = express();
const port = env.PORT;
const server = createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true
    }
});

// Basic middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));


// CORS configuration
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));


// Socket.IO initialization
initializeSocket(io);

// Routes
app.use("/api/", routes);
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running");
});

// Setup cron job to clean up expired bookings every 5 minutes
cron.schedule('*/5 * * * *', async () => {
    console.log('Running booking cleanup...');
    try {
        await bookingService.cleanupExpiredBookings();
    } catch (error) {
        console.error('Error during booking cleanup:', error);
    }
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log('Booking cleanup cron job scheduled to run every 5 minutes');
});

