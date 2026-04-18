import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ErrorMap, StatusCodeMap } from "../constants/errors.js";

const JWT_KEY = process.env.JWT_KEY!;

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1]; // expects "Bearer <token>"

    if (!token) {
      return next({ status: StatusCodeMap[ErrorMap["INVALID_SESSION"]], message: ErrorMap["INVALID_SESSION"] });
    }

    const decoded = jwt.verify(token, JWT_KEY) as { userId: string; email: string };
    (req as any).userId = decoded.userId;
    (req as any).email = decoded.email;
    next();
  } catch {
    return next({ status: StatusCodeMap[ErrorMap["INVALID_SESSION"]], message: ErrorMap["INVALID_SESSION"] });
  }
}