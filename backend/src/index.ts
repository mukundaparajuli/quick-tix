import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import routes from "./routes/index"
import errorHandler from "./middlewares/error-handler";
import cookieParser from 'cookie-parser';
import logger from "./logger";
import morgan from "morgan";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT;
const morganFormat = ":method :url :status :response-time ms";

// Basic middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"))

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

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

// Routes
app.use("/api/", routes)
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running")
})

app.listen(port, () => {
    console.log("listening to the port " + port);
})