import { NextFunction, Request, Response } from "express";
import { ERoles } from "@/models/user.model";

export const authorize = (roles: ERoles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const role = req.user?.role;

      if (!userId) return res.status(401).json({ success: false, message: "Please signin first." });
      if (!roles.includes(role))
        return res.status(403).json({ success: false, message: "You cannot access this route." });

      next();
    } catch (error) {
      next(error);
    }
  };
};
