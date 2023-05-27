import axios from "axios";
import { Request, Response } from "express";
import { Octokit } from "octokit";
import prisma from "../../../prisma";
import { generateAccessToken } from "../../../utils/generateAccessToken";

const githubAuthCallback = async (req: Request, res: Response) => {
  const { code } = req.query;
  const {
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    CLIENT_SUCCESS_REDIRECT,
    CLIENT_ERROR_REDIRECT,
  } = process.env;

  try {
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }
    );

    const accessToken = new URLSearchParams(response.data).get("access_token");

    if (accessToken) {
      const octokit = new Octokit({
        auth: accessToken,
      });

      const userResponse = await octokit.request("GET /user");

      const userEmails = await octokit.request("GET /user/emails");

      const user = userResponse.data;
      const email = userEmails.data[0].email;

      const userExists = await prisma.user.findFirst({
        where: {
          github_id: user.id,
        },
      });

      if (userExists) {
        generateAccessToken(res, userExists.uuid);
        return res.redirect(CLIENT_SUCCESS_REDIRECT as string);
      }

      const newUser = await prisma.user.create({
        data: {
          email,
          username: user.login,
          email_verified: true,
          github_id: user.id,
          auth_method: "github",
        },
      });
      generateAccessToken(res, newUser.uuid);
      res.redirect(CLIENT_SUCCESS_REDIRECT as string);
    } else {
      throw new Error("Failed to obtain access token from GitHub");
    }
  } catch (error) {
    console.error(error);
    res.redirect(CLIENT_ERROR_REDIRECT as string);
  }
};

export { githubAuthCallback };
