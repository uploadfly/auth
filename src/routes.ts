import expres from "express";
import { signup } from "./controllers/signup";
import { login } from "./controllers/login";
import { verifyEmail } from "./controllers/verify";
import { resendOTP } from "./controllers/resend";
import { githubAuth } from "./controllers/github";
import { githubAuthCallback } from "./controllers/github/callback";
import { logout } from "./controllers/logout";
import { refreshToken } from "./controllers/refresh";
import { forgotPassword } from "./controllers/forgot-password";
import { resetPassword } from "./controllers/reset-password";

const router = expres.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/verify", verifyEmail);
router.put("/verify/resend", resendOTP);
router.get("/github", githubAuth);
router.post("/refresh", refreshToken);
router.get("/github/callback/", githubAuthCallback);
router.post("/logout", logout);
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);

export default router;
