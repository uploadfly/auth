import { Request, Response } from "express";
import validator from "validator";
import prisma from "../../prisma";
import { generateOTP } from "../../utils/generateOtp";
import passwordReset from "../../emails/passwordReset";
import dayjs from "dayjs";

const forgotPassword = async (req: Request, res: Response) => {
  const email: string = req.body.email;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(404).json({
      message: "There is not account associated with this email",
    });
  }
  const otp = generateOTP(4);

  passwordReset(user.email, otp);

  await prisma.user.update({
    where: { email },
    data: {
      otp,
      otp_expiry: dayjs().add(30, "minutes").toISOString(),
    },
  });
  res.status(200).json({ message: "OTP sent" });
};

export { forgotPassword };
