import {
  addBlogHandler,
  getAllBlogHandler,
  getBlogHandler,
  updateBlogHandler,
} from "@/controllers/blog.controller";
import { authorize } from "@/middlewares/authorize";
import { ERoles } from "@/models/user.model";
import { Router } from "express";

const blogRouter = Router();

blogRouter.get("/", getAllBlogHandler);
blogRouter.get("/:blogId", getBlogHandler);
blogRouter.post("/add", authorize([ERoles.ADMIN, ERoles.USER]), addBlogHandler);
blogRouter.patch("/update/:blogId", authorize([ERoles.ADMIN, ERoles.USER]), updateBlogHandler);

export default blogRouter;
