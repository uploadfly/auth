import { Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import generate from "boring-name-generator";

const generateAccessToken = (res: Response, uuid: string) => {
  const secretKey = process.env.JWT_SECRET_KEY as Secret;

  const payload = {
    uuid,
  };

  const expiresIn = "1h";

  const isProduction = process.env.NODE_ENV === "production";

  const accessToken = jwt.sign(payload, secretKey, { expiresIn });

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "strict",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("exp", generate().dashed, {
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
    maxAge: 60 * 60 * 1000,
  });
};

export { generateAccessToken };
