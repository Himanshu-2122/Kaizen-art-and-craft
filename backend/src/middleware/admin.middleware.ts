import { Response, NextFunction } from "express";
import { protect } from "./auth.middleware";

export const isAdmin = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin only access" });
  }

  next();
};
