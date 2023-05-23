import { Request, Response } from "express";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
      passReqToCallback: true,
    },
    async (accessToken: any, refreshToken: any, profile: any, cb: any) => {
      console.log(accessToken, refreshToken, profile);
      return cb(null, profile);
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
