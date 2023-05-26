import express from "express";
import bodyParser from "body-parser";
import authRouter from "./src/routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", authRouter);

const PORT = process.env.PORT || 1112;

app.listen(PORT, () => {
  console.log("Server is live");
});
