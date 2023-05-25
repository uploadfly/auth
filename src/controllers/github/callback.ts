import axios from "axios";
import { Request, Response } from "express";
import { Octokit } from "octokit";

const githubAuthCallback = async (req: Request, res: Response) => {
  const { code } = req.query;
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

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

      const userResponse = await octokit.request("GET /user", {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      const user = userResponse.data;
      console.log(user);

      res.redirect("/");
    } else {
      throw new Error("Failed to obtain access token from GitHub");
    }
  } catch (error) {
    console.error(error);
    res.redirect("/login");
  }
};

export { githubAuthCallback };
