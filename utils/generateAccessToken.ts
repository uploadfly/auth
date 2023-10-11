import { Response } from "express";
import { Secret, sign } from "jsonwebtoken";
import prisma from "../prisma";
import dayjs from "dayjs";
import Sentry from "../sentry";

const generateAccessToken = async (res: Response, id: string) => {
  const secretKey = process.env.JWT_SECRET_KEY as Secret;

  const isProd = process.env.NODE_ENV === "production";
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    const payload = {
      id,
      username: user?.username,
    };

    const userExistingToken = await prisma.refreshToken.findFirst({
      where: {
        user_id: id,
      },
    });

    if (dayjs().isAfter(dayjs(userExistingToken?.expires_at))) {
      await prisma.refreshToken.delete({
        where: {
          id: userExistingToken?.id,
        },
      });
      res.status(401).json({ message: "Token has expired" });
    }

    const accessToken = sign(payload, secretKey, { expiresIn: "15m" });

    const refreshToken =
      userExistingToken?.token ||
      sign(payload, secretKey, { expiresIn: "90d" });

    if (!userExistingToken) {
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          user_id: id,
          expires_at: dayjs().add(90, "days").toISOString(),
        },
      });
    }
    res.cookie("access_token", accessToken, {
      domain: isProd ? ".uploadfly.co" : undefined,
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "strict",
      expires: dayjs().add(15, "m").toDate(),
    });

    res.cookie("refresh_token", refreshToken, {
      domain: isProd ? ".uploadfly.co" : undefined,
      secure: isProd,
      sameSite: isProd ? "none" : "strict",
      expires: dayjs().add(90, "days").toDate(),
      httpOnly: true,
    });
  } catch (error) {
    Sentry.captureException(error);
  }
};

export { generateAccessToken };
