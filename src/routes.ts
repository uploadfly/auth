import expres from "express";
import { signup } from "./controllers/signup";
import { login } from "./controllers/login";
import { verifyEmail } from "./controllers/verify";
import { resendOTP } from "./controllers/resend";
// import { githubAuth } from "./controllers/github";
// import passport from "passport";

import passportConfig from "./configs/passport";

const router = expres.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/verify", verifyEmail);
router.put("/verify/resend", resendOTP);
router.get("/github", passportConfig.authenticate("github"));
export default router;
