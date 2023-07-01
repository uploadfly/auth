import { Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import generate from "boring-name-generator";

const generateAccessToken = (res: Response, uuid: string) => {
  const secretKey = process.env.JWT_SECRET_KEY as Secret;

  const payload = {
    uuid,
  };

  const isProd = process.env.NODE_ENV === "production";

  const expiresIn = "1h";

  const accessToken = jwt.sign(payload, secretKey, { expiresIn });

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "strict",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("exp", generate().dashed, {
    secure: isProd,
    sameSite: isProd ? "none" : "strict",
    maxAge: 60 * 60 * 1000,
  });
};

export { generateAccessToken };
