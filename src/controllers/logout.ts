import { Request, Response } from "express";

const logout = async (req: Request, res: Response) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("access_token", {
    domain: isProd ? ".uploadfly.cloud" : undefined,
  });
  res.clearCookie("refresh_token", {
    domain: isProd ? ".uploadfly.cloud" : undefined,
  });
  res.sendStatus(200);
};

export { logout };
