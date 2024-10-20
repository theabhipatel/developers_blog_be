import { EBlogStatus } from "@/models/blog.model";
import { isValidObjectId } from "mongoose";
import { object, string, enum as enum_ } from "zod";

const blogStatusEnum = Object.values(EBlogStatus) as [EBlogStatus, ...EBlogStatus[]];

export const addBlogSchema = object({
  body: object({
    title: string({ required_error: "title is required." }),
    slug: string({ required_error: "slug is required." }),
    thumbnail: string({ required_error: "thumbnail is required." }).url(),
    content: string({ required_error: "content is required." }),
    status: enum_(blogStatusEnum),
  }),
});

export const getBlogSchema = object({
  params: object({
    blogId: string({ required_error: "blogId is required." }).refine((id) => isValidObjectId(id), {
      message: "Invalid blogId. Must be a valid MongoDB ObjectId.",
    }),
  }),
});
