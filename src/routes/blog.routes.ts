import {
  addBlogHandler,
  addCommentToBlogHandler,
  getAllBlogsHandler,
  getAllCommentsForABlogHandler,
  getAllMyBlogsHandler,
  getBlogByIdHandler,
  getBlogBySlugHandler,
  getUsersAllBlogByUserIdHandler,
  likeUnlikeBlogHandler,
  updateBlogHandler,
} from "@/controllers/blog.controller";
import { authorize } from "@/middlewares/authorize";
import { validate } from "@/middlewares/validate";
import { ERoles } from "@/models/user.model";
import {
  addBlogSchema,
  addCommentToBlogSchema,
  getAllCommentsForABlogSchema,
  getBlogBySlugSchema,
  getBlogSchema,
  getUsersAllBlogByUserIdSchema,
  likeUnlikeBlogSchema,
  updateBlogSchema,
} from "@/validation/blog";
import { Router } from "express";

const blogRouter = Router();

/** Add, update and delete routes. */
blogRouter.post(
  "/add",
  authorize([ERoles.ADMIN, ERoles.USER]),
  validate(addBlogSchema),
  addBlogHandler
);
blogRouter.patch(
  "/update/:blogId",
  authorize([ERoles.ADMIN, ERoles.USER]),
  validate(updateBlogSchema),
  updateBlogHandler
);
blogRouter.post(
  "/like/:blogId",
  validate(likeUnlikeBlogSchema),
  authorize([ERoles.ADMIN, ERoles.USER]),
  likeUnlikeBlogHandler
);
blogRouter.post(
  "/comment",
  validate(addCommentToBlogSchema),
  authorize([ERoles.ADMIN, ERoles.USER]),
  addCommentToBlogHandler
);

/** ---> Get routes. */
blogRouter.get("/", getAllBlogsHandler);
blogRouter.get("/my-blogs", authorize([ERoles.ADMIN, ERoles.USER]), getAllMyBlogsHandler);
blogRouter.get("/slug/:slug", validate(getBlogBySlugSchema), getBlogBySlugHandler);
blogRouter.get(
  "/user/:userId",
  validate(getUsersAllBlogByUserIdSchema),
  getUsersAllBlogByUserIdHandler
);
blogRouter.get(
  "/comment/:blogId",
  validate(getAllCommentsForABlogSchema),
  getAllCommentsForABlogHandler
);
blogRouter.get("/:blogId", validate(getBlogSchema), getBlogByIdHandler);

export default blogRouter;
