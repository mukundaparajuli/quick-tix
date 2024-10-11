import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import routes from "./routes/index"
import errorHandler from "./middlewares/error-handler";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/api/", routes)

app.use(errorHandler);

app.listen(port, () => {
    console.log("listening to the port " + port);
})