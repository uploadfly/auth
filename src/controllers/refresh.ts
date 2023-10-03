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
      id: string;
    };
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessToken = sign(
      {
        id: user.id,
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
    res.send("ok");
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { refreshToken };
