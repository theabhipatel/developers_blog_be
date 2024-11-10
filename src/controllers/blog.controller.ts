import { IBlog } from "@/interfaces/IBlog";
import blogModel from "@/models/blog.model";
import blogReadModel from "@/models/blogRead.model";
import commentModel from "@/models/comment.model";
import followerModel from "@/models/follower.model";
import likeModel from "@/models/like.model";
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
    const viewerId = req.user?.userId;
    const userIp = req.ip;

    const blog = await blogModel
      .findOne({ slug })
      .populate({
        path: "user",
        select: "email username",
        populate: {
          path: "userProfile",
          model: "userProfile",
          select: "firstName lastName profilePic bio",
        },
      })
      .lean();

    if (!blog) {
      res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
      return;
    }

    const likes = await likeModel.find({ blog: blog._id }).countDocuments();

    let isFollowed: boolean = false;
    let isLiked: boolean = false;
    if (viewerId) {
      /** ---> Checking user either follow or not.*/
      const isFollowedExists = await followerModel.findOne({
        follower: viewerId,
        following: (blog?.user as unknown as { _id: string })._id,
      });
      isFollowed = !!isFollowedExists;

      /** ---> Checking user either like blog or not.*/
      const isLikeExists = await likeModel.findOne({
        user: viewerId,
        blog: blog._id,
      });
      isLiked = !!isLikeExists;
    }

    /*  eslint-disable */
    const transformedBlog = (blog: any) => {
      const user = (blog as IBlog).user;

      if (user.userProfile) {
        (user as any).profilePic = user.userProfile.profilePic;
        (user as any).firstName = user.userProfile.firstName;
        (user as any).lastName = user.userProfile.lastName;
        (user as any).isFollowed = isFollowed;
        (user as any).isLiked = isLiked;
        delete user.userProfile;
      }
      return {
        user,
        likes,
        ...blog,
      };
    };
    /*  eslint-enable */

    res.status(200).json({
      success: true,
      message: "Blog fetched successfully.",
      blog: transformedBlog(blog),
    });

    /** ---> Tracking user's reads */
    const existingRead = await blogReadModel.findOne({ blog: blog._id, userIp });
    if (!existingRead) {
      await blogReadModel.create({ blog: blog._id, userIp });

      /** --->  Updating the blog's reads count */
      await blogModel.findByIdAndUpdate(blog?._id, { $inc: { reads: 1 } });
    }
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

export const getUsersAllBlogByUserIdHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;
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

export const likeUnlikeBlogHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { blogId } = req.params;

    const existingLike = await likeModel.findOne({ user: userId, blog: blogId });

    if (existingLike) {
      await likeModel.findByIdAndDelete(existingLike._id);
      res.status(200).json({ message: "Blog unliked successfully" });
      return;
    }

    await likeModel.create({ user: userId, blog: blogId });

    res.status(200).json({ message: "Blog liked successfully" });
  } catch (error) {
    next(error);
  }
};

export const addCommentToBlogHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { blogId, content } = req.body;

    await commentModel.create({ user: userId, blog: blogId, content });
    res.status(200).json({ message: "Comment added successfully" });

    await blogModel.findByIdAndUpdate(blogId, { $inc: { comments: 1 } });
  } catch (error) {
    next(error);
  }
};

export const getAllCommentsForABlogHandler: RequestHandler = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const comments = await commentModel
      .find({ blog: blogId })
      .populate({
        path: "user",
        select: "username",
        populate: {
          path: "userProfile",
          model: "userProfile",
          select: "firstName lastName profilePic",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    /*  eslint-disable */
    const transformedComments = (comments as any[]).map((comment: any) => {
      const user = comment.user;

      if (user.userProfile) {
        (user as any).profilePic = user.userProfile.profilePic;
        (user as any).firstName = user.userProfile.firstName;
        (user as any).lastName = user.userProfile.lastName;
        delete user.userProfile;
      }
      return {
        ...comment,
        user,
      };
    });
    /*  eslint-enable */

    res
      .status(200)
      .json({ message: "Comments fetched successfully", comments: transformedComments });
  } catch (error) {
    next(error);
  }
};
