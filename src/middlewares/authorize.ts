import { NextFunction, Request, Response } from "express";
import { ERoles } from "@/models/user.model";

export const authorize = (roles: ERoles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const role = req.user?.role;

      if (!userId) {
        res.status(401).json({ success: false, message: "Please signin first." });
        return;
      }
      if (!roles.includes(role)) {
        res.status(403).json({ success: false, message: "You cannot access this route." });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
