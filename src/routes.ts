import expres from "express";
import { signup } from "./controllers/signup";
import { login } from "./controllers/login";
import { verifyEmail } from "./controllers/verify";

const router = expres.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/verify", verifyEmail);

export default router;
