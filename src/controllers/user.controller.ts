import { CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "@/config";
import followerModel from "@/models/follower.model";
import userModel from "@/models/user.model";
import userProfileModel from "@/models/userProfile.model";
import { cloudinary } from "@/utils/cloudinary";
import { RequestHandler } from "express";

export const getUserProfileByUserNameHandler: RequestHandler = async (req, res, next) => {
  try {
    const username = req.params.username;
    const viewerId = req.user?.userId;

    const user = await userModel.findOne({ username });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }
    const profile = await userProfileModel.findOne({ user: user?._id }).lean();
    const followers = await followerModel.find({ following: user._id }).countDocuments();

    if (user._id === viewerId) {
      res.status(200).json({
        success: true,
        message: "Profile fetched successfully.",
        profile: { followers, ...profile },
      });
      return;
    }

    let isFollowed: boolean = false;
    if (viewerId) {
      /** ---> Checking user either follow or not.*/
      const isFollowedExists = await followerModel.findOne({
        follower: viewerId,
        following: user._id,
      });
      isFollowed = !!isFollowedExists;
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      profile: { isFollowed: !!isFollowed, email: user.email, followers, ...profile },
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

export const unFollowUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const following = req.params.followingId;
    const existingFollow = await followerModel.deleteOne({ follower: userId, following });
    if (!existingFollow) {
      res.status(404).json({ success: false, message: "Follow relationship not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Unfollowed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfileHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, profilePic, bio } = req.body;

    const user = await userProfileModel.findOneAndUpdate(
      { user: userId },
      { firstName, lastName, profilePic, bio }
    );

    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const uploadProfilePictureHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    // const { firstName, lastName, profilePic, bio } = req.body;

    // const user = await userProfileModel.findOneAndUpdate(
    //   { user: userId },
    //   { firstName, lastName, profilePic, bio }
    // );

    // if (!user) {
    //   res.status(404).json({ success: false, message: "User not found." });
    //   return;
    // }

    const publicId = `user_profiles/${userId}`;
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        public_id: publicId,
        timestamp,
      },
      CLOUDINARY_API_SECRET
    );

    res.status(200).json({
      success: true,
      message: "Updated successfully.",
      signature,
      timestamp,
      cloud_name: CLOUDINARY_CLOUD_NAME,
      upload_preset: "user_profile_upload_preset", // [::] TODO : Need to add this preset name in env
      public_id: publicId,
    });
  } catch (error) {
    next(error);
  }
};
