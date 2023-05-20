import { Request, Response } from "express";
import prisma from "../../prisma";
import dayjs from "dayjs";

const verifyEmail = async (req: Request, res: Response) => {
  const { otp } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      otp,
    },
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  if (dayjs().isBefore(dayjs(user.otp_expiry))) {
    return res.status(400).json({
      message: "OTP has expired",
    });
  }

  await prisma.user.update({
    where: {
      uuid: user.uuid,
    },
    data: {
      email_verified: true,
      otp: "",
      otp_expiry: "",
    },
  });
};

export { verifyEmail };
