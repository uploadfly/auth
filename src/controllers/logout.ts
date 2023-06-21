import { Request, Response } from "express";

const logout = async (req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("exp");
  res.sendStatus(200);
};

export { logout };
