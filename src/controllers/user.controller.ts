import userModel from "@/models/user.model";
import userProfileModel from "@/models/userProfile.model";
import { RequestHandler } from "express";

export const getUserProfileByUserName: RequestHandler = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await userModel.findOne({ username });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }
    const profile = await userProfileModel.findOne({ user: user?._id });

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      profile,
    });
  } catch (error) {
    next(error);
  }
};
