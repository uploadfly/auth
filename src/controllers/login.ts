import { Request, Response } from "express";
import prisma from "../../prisma";
import bcrypt from "bcrypt";

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const correctPassword = bcrypt.compareSync(password, user.password);

  if (!correctPassword) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  if (!user.email_verified) {
    return res.status(400).json({
      message: "Email is not verified",
    });
  }

  return res.status(200).json({
    message: "Success",
  });
};

export { login };
