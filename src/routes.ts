import expres from "express";
import { signup } from "./controllers/signup";
import { login } from "./controllers/login";
import { verifyEmail } from "./controllers/verify";
import { resendOTP } from "./controllers/resend";
import { githubAuth } from "./controllers/github";
import { githubAuthCallback } from "./controllers/github/callback";
import { logout } from "./controllers/logout";
import sendOTP from "../emails/sendOTP";

const router = expres.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/verify", verifyEmail);
router.put("/verify/resend", resendOTP);
router.get("/github", githubAuth);
router.get("/github/callback/", githubAuthCallback);
router.post("/logout", logout);
router.get("/email", (req, res) => {
  sendOTP("bossoncode@gmail.com", "o8s2");
  res.send("Email Sent");
});

export default router;
