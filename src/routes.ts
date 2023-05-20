import expres from "express";
import { signup } from "./controllers/signup";
import { login } from "./controllers/login";

const router = expres.Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;
