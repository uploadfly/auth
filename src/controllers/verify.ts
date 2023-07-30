import { Request, Response } from "express";
import prisma from "../../prisma";
import dayjs from "dayjs";
import { generateAccessToken } from "../../utils/generateAccessToken";
import welcomeToUploadfly from "../../emails/welcomeToUF";

const verifyEmail = async (req: Request, res: Response) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({
      message: "OTP is required",
    });
  }

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

  if (dayjs().isAfter(dayjs(user.otp_expiry))) {
    return res.status(400).json({
      message: "OTP has expired",
    });
  }

  const verifiedUser = await prisma.user.update({
    where: {
      uuid: user.uuid,
    },
    data: {
      email_verified: true,
      otp: "",
      otp_expiry: null,
    },
  });

  const userData = {
    username: verifiedUser?.username,
    email: verifiedUser?.email,
  };

  generateAccessToken(res, verifiedUser.uuid);

  welcomeToUploadfly(verifiedUser.email);

  return res.status(200).json({
    message: "Verified",
    user: userData,
  });
};

export { verifyEmail };
