import { Request, Response } from "express";
import prisma from "../../prisma";
import validator from "validator";

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

  await prisma.user.create({
    data: {
      email,
      username: email.split("@")[0],
      password,
    },
  });

  res.status(201).json({ message: "User created" });
};

export { signup };
