import { Request, Response } from "express";
import prisma from "../../prisma";
import validator from "validator";
import { generateOTP } from "../../utils/generateOtp";
import { sendEmail } from "../../utils/sendEmail";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import sendOTP from "../../emails/sendOTP";
import { logsnag } from "../configs/logsnag";

const signup = async (req: Request, res: Response) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword)
    return res.status(400).json({ message: "All fields are required" });

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const otp = generateOTP(4);

  const userExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userExists) {
    return res
      .status(409)
      .json({ message: "There is an account associated with this email" });
  }

  sendOTP(email, otp);

  await logsnag.publish({
    channel: "user-signup",
    event: "New user signup",
    description: email,
    icon: "💯",
    notify: true,
  });

  await prisma.user.create({
    data: {
      email,
      username: email.split("@")[0].toLowerCase(),
      password: bcrypt.hashSync(password, 10),
      otp,
      otp_expiry: dayjs().add(30, "minutes").toISOString(),
      auth_method: "email and password",
    },
  });

  res.status(201).json({ message: "User created" });
};

export { signup };
