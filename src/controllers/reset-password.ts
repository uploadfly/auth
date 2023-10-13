import { Request, Response } from "express";
import prisma from "../../prisma";
import dayjs from "dayjs";
import bcrypt from "bcryptjs";

const resetPassword = async (req: Request, res: Response) => {
  const {
    otp,
    password,
    confirmPassword,
  }: { otp: string; password: string; confirmPassword: string } = req.body;

  if (!otp) {
    return res.status(400).json({
      message: "OTP is required",
    });
  }

  if (!password || !confirmPassword) {
    return res.status(400).json({
      message: "Password is required",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match",
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      otp,
    },
  });

  if (!user) {
    return res.status(400).json({
      message: "OTP is invalid",
    });
  }

  if (dayjs().isAfter(dayjs(user.otp_expiry))) {
    return res.status(400).json({
      message: "OTP has expired",
    });
  }

  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: bcrypt.hashSync(password, 10),
      otp: "",
      otp_expiry: null,
    },
  });
  res.status(200).json({ message: "Password has been reset" });
};

export { resetPassword };
