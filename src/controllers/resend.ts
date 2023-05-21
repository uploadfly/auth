import { Request, Response } from "express";
import prisma from "../../prisma";
import { generateOTP } from "../../utils/generateOtp";
import { sendEmail } from "../../utils/sendEmail";
import dayjs from "dayjs";

const resendOTP = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({
      message: "There is no account associated with this email",
    });
  }

  if (user.email_verified) {
    return res.status(400).json({
      message: "Email is already verified",
    });
  }

  const otp = generateOTP();

  await sendEmail({
    to: email,
    subject: "Verify your email",
    body: `Your verification code is ${otp}`,
  });

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      otp,
      otp_expiry: dayjs().add(30, "minutes").toISOString(),
    },
  });

  return res.status(200).json({ message: "OTP sent" });
};
export { resendOTP };
