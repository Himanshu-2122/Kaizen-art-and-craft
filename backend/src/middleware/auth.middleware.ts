import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const protect = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (err: any) {
    const message = err?.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    return res.status(401).json({ message });
  }
};

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user.role !== "admin")
    return res.sendStatus(403);

  next();
};
