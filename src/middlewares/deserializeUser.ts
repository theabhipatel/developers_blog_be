import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/config";
import userModel, { ERoles } from "@/models/user.model";
import { errorLog } from "@/utils/colorLogs";

/** ---> Modifing request type and added user */
/* eslint-disable */
declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        role: ERoles;
      };
    }
  }
}
/* eslint-enable */

export const deserializeUser: RequestHandler = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    if (header) {
      const [bearer, token] = header.split(" ");
      if (bearer === "Bearer") {
        const userInfo = jwt.verify(token, JWT_SECRET) as {
          userId: string;
          role: ERoles;
        };
        if (userInfo) {
          const user = await userModel.findById(userInfo.userId);
          if (user && !user.isBlocked) {
            if (!req.user) {
              req.user = { userId: "", role: ERoles.USER };
            }
            req.user.userId = userInfo.userId;
            req.user.role = user.role;
          }
        }
      }
    }

    next();
  } catch (error) {
    errorLog(["deserialize middleware error : ", error]);
    next();
  }
};
