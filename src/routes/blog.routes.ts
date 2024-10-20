import {
  addBlogHandler,
  getAllBlogHandler,
  getBlogHandler,
  updateBlogHandler,
} from "@/controllers/blog.controller";
import { authorize } from "@/middlewares/authorize";
import { validate } from "@/middlewares/validate";
import { ERoles } from "@/models/user.model";
import { addBlogSchema, getBlogSchema, updateBlogSchema } from "@/validation/blog";
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

/** ---> Get routes. */
blogRouter.get("/", getAllBlogHandler);
blogRouter.get("/:blogId", validate(getBlogSchema), getBlogHandler);

export default blogRouter;
