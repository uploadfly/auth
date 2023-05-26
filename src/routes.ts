import expres, { Request, Response } from "express";
import { signup } from "./controllers/signup";
import { login } from "./controllers/login";
import { verifyEmail } from "./controllers/verify";
import { resendOTP } from "./controllers/resend";
import { githubAuth } from "./controllers/github";
import { githubAuthCallback } from "./controllers/github/callback";

const router = expres.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/verify", verifyEmail);
router.put("/verify/resend", resendOTP);
router.get("/github", githubAuth);
router.get("/github/callback/", githubAuthCallback);
router.post("/logout", async (req: Request, res: Response) => {
  res.cookie("access_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.sendStatus(200);
});

export default router;
