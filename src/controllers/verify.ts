import { Request, Response } from "express";
import prisma from "../../prisma";
import dayjs from "dayjs";
import { generateAccessToken } from "../../utils/generateAccessToken";
import welcomeToUploadfly from "../../emails/welcomeToUF";
import { isProd } from "../../utils/isProd";
// import subToPlunk from "../../utils/subcribeToPlunk";

const verifyEmail = async (req: Request, res: Response) => {
  const { otp, email } = req.body;

  if (!otp) {
    return res.status(400).json({
      message: "OTP is required",
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      otp,
      email,
    },
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid validation link",
    });
  }

  if (dayjs().isAfter(dayjs(user.otp_expiry))) {
    return res.status(400).json({
      message: "Validation link has expired",
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

  await generateAccessToken(res, verifiedUser.uuid);

  isProd && welcomeToUploadfly(verifiedUser.email);
  // subToPlunk(verifiedUser.email)

  return res.status(200).json({
    message: "Verified",
    user: userData,
  });
};

export { verifyEmail };
