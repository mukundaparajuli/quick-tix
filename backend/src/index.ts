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

dotenv.config();

const app = express();
const port = env.PORT;
const server = createServer(app);
export const io = new Server(server, {
    cors: {
        origin: env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Basic middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));


// CORS configuration
app.use(cors({
    origin: env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],

}));

// Socket.IO initialization
initializeSocket(io);

// Routes
app.use("/api/", routes);
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running");
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

