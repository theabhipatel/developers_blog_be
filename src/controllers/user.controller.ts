import userModel from "@/models/user.model";
import { RequestHandler } from "express";

export const getUserByUserName: RequestHandler = async (req, res, next) => {
  try {
    const username = req.params.username;
    const profile = await userModel.findOne({ username });

    res.status(201).json({
      success: true,
      message: "Profile fetched successfully.",
      profile,
    });
  } catch (error) {
    next(error);
  }
};
