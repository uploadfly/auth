import passport from "../configs/passport";

const githubCallback = passport.authenticate("github", {
  successRedirect: "/user",
  failureRedirect: "/login",
});

export { githubCallback };
