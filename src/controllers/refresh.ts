// backend/src/routes/auth.ts
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken) as { userId: number };

    // Check if the refresh token is valid and belongs to the user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user || user.refreshToken !== refreshToken) {
      return res.sendStatus(401);
    }

    // Generate a new access token
    const accessToken = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: "15m",
    });

    return res.json({ accessToken });
  } catch (error) {
    return res.sendStatus(401);
  }
};

export { refresh };
