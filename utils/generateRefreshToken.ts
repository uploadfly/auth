import crypto from "crypto";

const generateRefreshToken = () => {
  const refreshToken = crypto.randomBytes(64).toString("hex");
  return refreshToken;
};

export { generateRefreshToken };
