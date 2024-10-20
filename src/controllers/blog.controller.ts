import blogModel from "@/models/blog.model";
import { RequestHandler } from "express";

export const addBlogHandler: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { title, slug, thumbnail, content, status } = req.body;

    const uniqueSlug = `${slug}-${new Date().getTime().toString(36)}`;

    await blogModel.create({
      user: userId,
      title,
      slug: uniqueSlug,
      thumbnail,
      content,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Blog added successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBlogHandler: RequestHandler = async (req, res, next) => {
  try {
    const blogs = await blogModel.find({}).select("-content");
    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully.",
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogHandler: RequestHandler = async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const blog = await blogModel.findById(blogId).populate({
      path: "user",
      select: "email",
      populate: {
        path: "userProfile",
        model: "userProfile",
        select: "firstName lastName profilePic bio",
      },
    });

    if (!blog) {
      res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Blog fetched successfully.",
      blog,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlogHandler: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};
