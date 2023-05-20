import bodyParser from "body-parser";
import express from "express";
import authRouter from "./src/routes";
import { sendEmail } from "./utils/sendEmail";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  (async () => {
    await sendEmail({
      to: "akinkunmioye42@gmail.com",
      subject: "Hey",
      body: "Hello there",
    });
    res.send("Email sent");
  })();
});

app.use("/", authRouter);

const PORT = process.env.PORT || 1112;

app.listen(PORT, () => {
  console.log("Live");
});
