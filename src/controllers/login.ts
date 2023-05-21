import { Request, Response } from "express";
import prisma from "../../prisma";
import bcrypt from "bcrypt";
import { generateRefreshToken } from "../../utils/generateRefreshToken";
import { calculateRefreshTokenExpiry } from "../../utils/calculateRefreshTokenExpiry";
import dayjs from "dayjs";
import { generateAccessToken } from "../../utils/generateAccessToken";

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const correctPassword = bcrypt.compareSync(password, user.password);

  if (!correctPassword) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  if (!user.email_verified) {
    return res.status(400).json({
      message: "Email is not verified",
    });
  }

  const refreshToken = generateRefreshToken();
  const refreshTokenExpiry = calculateRefreshTokenExpiry();
  const accessToken = generateAccessToken(user.uuid);

  await prisma.user.update({
    where: { email },
    data: {
      refresh_token: refreshToken,
      refresh_token_expiry: refreshTokenExpiry,
    },
  });

  const responseToken = () => {
    if (user.refresh_token && dayjs().isBefore(user.refresh_token_expiry)) {
      return user.refresh_token;
    }
    return refreshToken;
  };

  return res.status(200).json({
    message: "Success",
    accessToken,
    refreshToken: responseToken(),
  });
};

export { login };
