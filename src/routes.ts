import expres from "express";
import { signup } from "./controllers/signup";
import { login } from "./controllers/login";
import { verifyEmail } from "./controllers/verify";
import { resendOTP } from "./controllers/resend";

import passportConfig from "./configs/passport";
import { githubCallback } from "./controllers/github-callback";

const router = expres.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/verify", verifyEmail);
router.put("/verify/resend", resendOTP);
router.get(
  "/github",
  passportConfig.authenticate("github", {
    scope: ["user:email"],
  })
);
router.get("/github/callback", githubCallback);
export default router;
