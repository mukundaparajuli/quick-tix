import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import routes from "./routes/index"

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use("/api/", routes)

app.listen(port, () => {
    console.log("listening to the port " + port);
})