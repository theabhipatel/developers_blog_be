import { IBlog } from "@/interfaces/IBlog";
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

export const updateBlogHandler: RequestHandler = async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const { title, thumbnail, content, status } = req.body;

    const blog = await blogModel.findByIdAndUpdate(blogId, { title, thumbnail, content, status });

    if (!blog) {
      res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBlogsHandler: RequestHandler = async (req, res, next) => {
  try {
    const blogs = await blogModel
      .find({})
      .select("-content")
      .populate({
        path: "user",
        select: "username",
        populate: {
          path: "userProfile",
          model: "userProfile",
          select: "firstName lastName profilePic",
        },
      })
      .lean();

    /*  eslint-disable */
    const transformedBlogs = (blogs as any[]).map((blog: IBlog) => {
      const user = blog.user;

      if (user.userProfile) {
        (user as any).profilePic = user.userProfile.profilePic;
        (user as any).firstName = user.userProfile.firstName;
        (user as any).lastName = user.userProfile.lastName;
        delete user.userProfile;
      }
      return {
        ...blog,
        user,
      };
    });
    /*  eslint-enable */

    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully.",
      blogs: transformedBlogs,
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogByIdHandler: RequestHandler = async (req, res, next) => {
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

export const getBlogBySlugHandler: RequestHandler = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const blog = await blogModel.findOne({ slug }).populate({
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

export const getAllMyBlogsHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const blogs = await blogModel
      .find({ user: userId })
      .select("-content")
      .populate({
        path: "user",
        select: "username",
        populate: {
          path: "userProfile",
          model: "userProfile",
          select: "firstName lastName profilePic",
        },
      })
      .lean();

    /*  eslint-disable */
    const transformedBlogs = (blogs as any[]).map((blog: IBlog) => {
      const user = blog.user;

      if (user.userProfile) {
        (user as any).profilePic = user.userProfile.profilePic;
        (user as any).firstName = user.userProfile.firstName;
        (user as any).lastName = user.userProfile.lastName;
        delete user.userProfile;
      }
      return {
        ...blog,
        user,
      };
    });
    /*  eslint-enable */

    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully.",
      blogs: transformedBlogs,
    });
  } catch (error) {
    next(error);
  }
};
