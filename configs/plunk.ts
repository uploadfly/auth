import Plunk from "@plunk/node";
import { env } from "process";

const plunk = new Plunk(env.PLUNK_API_KEY);

export default plunk;
