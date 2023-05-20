import Plunk from "@plunk/node";
import env from "dotenv";
env.config();

const plunk = new Plunk(process.env.PLUNK_API_KEY as string);

export default plunk;
