import express from "express";
import bodyParser from "body-parser";
import authRouter from "./src/routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { record } from "@logdrop/node";
import { isProd } from "./utils/isProd";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
isProd && app.use(record(process.env.LOGDROP_API_KEY!));
app.use(cookieParser());

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/", authRouter);

const PORT = process.env.PORT || 1112;

app.listen(PORT, () => {
  console.log("Server is live");
});
