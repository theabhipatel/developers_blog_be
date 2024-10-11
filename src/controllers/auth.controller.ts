import { RequestHandler } from "express";

export const singupHandler: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Welcome to the Singup route." });
  } catch (error) {
    next(error);
  }
};
