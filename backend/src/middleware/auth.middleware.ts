import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const protect = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch {
    res.sendStatus(403);
  }
};

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user.role !== "admin")
    return res.sendStatus(403);

  next();
};
