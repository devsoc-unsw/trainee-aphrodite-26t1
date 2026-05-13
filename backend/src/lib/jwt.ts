import jwt from "jsonwebtoken";

const JWT_KEY = process.env.JWT_KEY!;

export interface JwtUserPayload {
  id: string;
  email: string;
}

export const verifyToken = (token: string): JwtUserPayload => {
  const decoded = jwt.verify(token, JWT_KEY);

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  return decoded as JwtUserPayload;
};