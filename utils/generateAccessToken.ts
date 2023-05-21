import jwt from "jsonwebtoken";

const generateAccessToken = (uuid: string) => {
  const secretKey = process.env.JWT_SECRET_KEY;

  const payload = {
    user_id: uuid,
  };

  const expiresIn = "1h";

  const accessToken = jwt.sign(payload, secretKey, { expiresIn });

  return accessToken;
};

export { generateAccessToken };
