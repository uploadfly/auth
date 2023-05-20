import { Request, Response } from "express";
import prisma from "../../prisma";
import validator from "validator";
import { generateOTP } from "../../utils/generateOtp";
import { sendEmail } from "../../utils/sendEmail";
import bcrypt from "bcrypt";

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

  const otp = generateOTP();

  await sendEmail({
    to: email,
    subject: "Signup OTP",
    body: `Your OTP is ${otp}`,
  });

  await prisma.user.create({
    data: {
      email,
      username: email.split("@")[0],
      password: bcrypt.hashSync(password, 10),
      otp,
    },
  });

  res.status(201).json({ message: "User created" });
};

export { signup };
