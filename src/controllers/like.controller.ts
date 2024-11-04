import likeModel from "@/models/like.model";
import { RequestHandler } from "express";

// [] TODO : This api is not fully tested. have to work on. still testing ...
export const likeBlogHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    // const following = req.params.followingId;
    // const existingFollow = await followerModel.findOne({ follower: userId, following });
    // if (existingFollow) {
    //   res.status(403).json({ success: false, message: "Already followed this user." });
    //   return;
    // }

    // await followerModel.create({ follower: userId, following });

    // res.status(200).json({
    //   success: true,
    //   message: "Followed successfully.",
    // });

    const { blogId } = req.params;

    const existingLike = await likeModel.findOne({ user: userId, blog: blogId });

    if (existingLike) {
      res.status(403).json({ message: "You have already liked this blog." });
      return;
    }

    const like = await likeModel.create({ user: userId, blog: blogId });

    res.status(201).json({ message: "Blog liked successfully", like });
  } catch (error) {
    next(error);
  }
};
