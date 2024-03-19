import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import routes from "./routes/routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

routes(app);

export default app;
