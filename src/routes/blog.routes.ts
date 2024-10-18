import {
  addBlogHandler,
  getAllBlogHandler,
  getBlogHandler,
  updateBlogHandler,
} from "@/controllers/blog.controller";
import { Router } from "express";

const blogRouter = Router();

blogRouter.get("/", getAllBlogHandler);
blogRouter.get("/:blogId", getBlogHandler);
blogRouter.post("/add", addBlogHandler);
blogRouter.patch("/update/:blogId", updateBlogHandler);

export default blogRouter;
