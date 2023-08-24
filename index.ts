import express from "express";
import bodyParser from "body-parser";
import authRouter from "./src/routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import * as Sentry from "@sentry/node";
const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({
      tracing: true,
    }),

    new Sentry.Integrations.Express({
      app,
    }),
  ],

  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/", authRouter);

app.use(Sentry.Handlers.errorHandler());

const PORT = process.env.PORT || 1112;

app.listen(PORT, () => {
  console.log("Server is live");
});
