import jwt from "jsonwebtoken";

type TokenPayload = {
  id: string;
  name: string;
  email: string;
};

export const generateToken = (payload: TokenPayload) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};
