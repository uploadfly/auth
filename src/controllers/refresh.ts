import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import prisma from "../../prisma";
import dayjs from "dayjs";
import dotenv from "dotenv";
dotenv.config();

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = verify(refreshToken, process.env.JWT_SECRET_KEY!) as {
      uuid: string;
    };
    const user = await prisma.user.findUnique({
      where: {
        uuid: decoded.uuid,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessToken = sign(
      {
        uuid: user.uuid,
        username: user.username,
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "15m" }
    );

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("access_token", accessToken, {
      domain: isProd ? ".uploadfly.cloud" : undefined,
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "strict",
      expires: dayjs().add(15, "m").toDate(),
    });
  } catch (error) {
    console.log(error);
  }
};
