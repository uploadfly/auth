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
  try {
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

    const correctPassword = bcrypt.compareSync(
      password,
      user.password as string
    );

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

    const userData = {
      username: user?.username,
      email: user?.email,
    };
    generateAccessToken(res, user.uuid);
    return res.status(200).json({
      message: "Success",
      user: userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export { login };
