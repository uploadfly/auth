import expres from "express";
import { signup } from "./controllers/signup";

const router = expres.Router();

router.post("/signup", signup);

export default router;
