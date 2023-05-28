import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../../prisma";

dotenv.config();

const getUser = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      res.sendStatus(403);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      user_id: string;
    };

    const user = await prisma.user.findUnique({
      where: {
        uuid: decoded.user_id,
      },
    });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
export { getUser };
