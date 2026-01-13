import "express-async-errors";
import express from "express";
import cors from "cors";
import fs from "fs";
import { routes } from "./routes";
import { uploadConfig } from "./config/upload";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

fs.mkdirSync(uploadConfig.directory, { recursive: true });
app.use("/uploads", express.static(uploadConfig.directory));

app.use("/api", routes);

app.use(errorHandler);

export { app };
