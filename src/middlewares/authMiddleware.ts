import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../prisma";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(
  async (req: Request, res: Response, next: Function) => {
    let token;

    token = req.cookies.access_token;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

        const user = await prisma.user.findUnique({
          where: {
            uuid: (decoded as { user_id: string }).user_id,
          },
        });

        if (user !== null) {
          req.user = user;
          next();
        } else {
          res.sendStatus(401);
        }
      } catch (error) {
        console.error(error);
        res.sendStatus(401);
      }
    } else {
      res.status(401).send("Not authorized, no token");
    }
  }
);

export { protect };
