import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import routes from "./routes/index";
import errorHandler from "./middlewares/error-handler";
import cookieParser from 'cookie-parser';
import logger from "./logger";
import morgan from "morgan";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./sockets";

dotenv.config();

const app = express();
const port = process.env.PORT;
const morganFormat = ":method :url :status :response-time ms";
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
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
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],

}));

// Logging middleware
app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => {
                const logObject = {
                    method: message.split(" ")[0],
                    url: message.split(" ")[1],
                    status: message.split(" ")[2],
                    responseTime: message.split(" ")[3],
                };
                logger.info(JSON.stringify(logObject));
            },
        },
    })
);

// Socket.IO initialization
initializeSocket(io);

// Routes
app.use("/api/", routes);
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running");
});

// Use `server.listen` to run both HTTP and Socket.IO
server.listen(port, () => {
    console.log("listening to the port " + port);
});
