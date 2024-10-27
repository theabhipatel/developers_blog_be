import followerModel from "@/models/follower.model";
import userModel from "@/models/user.model";
import userProfileModel from "@/models/userProfile.model";
import { RequestHandler } from "express";

export const getUserProfileByUserNameHandler: RequestHandler = async (req, res, next) => {
  try {
    const username = req.params.username;
    const viewerId = req.user.userId;

    const user = await userModel.findOne({ username });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }
    const profile = await userProfileModel.findOne({ user: user?._id }).lean();

    if (user._id === viewerId) {
      res.status(200).json({
        success: true,
        message: "Profile fetched successfully.",
        profile,
      });
      return;
    }

    const isFollowed = await followerModel.findOne({
      follower: viewerId,
      following: user._id,
    });

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      profile: { isFollowed: !!isFollowed, ...profile },
    });
  } catch (error) {
    next(error);
  }
};

export const followUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const following = req.params.followingId;
    const existingFollow = await followerModel.findOne({ follower: userId, following });
    if (existingFollow) {
      res.status(403).json({ success: false, message: "Already followed this user." });
      return;
    }

    await followerModel.create({ follower: userId, following });

    res.status(200).json({
      success: true,
      message: "Followed successfully.",
    });
  } catch (error) {
    next(error);
  }
};
