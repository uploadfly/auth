import bodyParser from "body-parser";
import express from "express";
import authRouter from "./src/routes";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(
    `<p> 
    You shouldn't be here but since you're here you can as well just <a href="https://github.com/uploadfly/uploadfly"> give us a star on GitHub</a>
    </p>`
  );
});

app.use("/", authRouter);

const PORT = process.env.PORT || 1112;

app.listen(PORT, () => {
  console.log("Live");
});
