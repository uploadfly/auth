import dotenv from "dotenv";
import { Request, Response } from "express";
import { Octokit } from "octokit";
dotenv.config();

const githubAuth = async (req: Request, res: Response) => {
  const { GITHUB_CLIENT_ID } = process.env;
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`
  );
};
export { githubAuth };
