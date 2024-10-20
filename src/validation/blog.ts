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
    status: enum_(blogStatusEnum, { required_error: "status is required." }),
  }),
});

export const updateBlogSchema = object({
  params: object({
    blogId: string({ required_error: "blogId is required." }).refine((id) => isValidObjectId(id), {
      message: "Invalid blogId. Must be a valid MongoDB ObjectId.",
    }),
  }),
  body: object({
    title: string({ message: "title must be string" }).optional(),
    thumbnail: string({ message: "thumbnail must be url string" })
      .url({ message: "thumbnail must be a url" })
      .optional(),
    content: string({ message: "content must be string" }).optional(),
    status: enum_(blogStatusEnum, {
      message: "status must be either draft or published",
    }).optional(),
  }),
});

export const getBlogSchema = object({
  params: object({
    blogId: string({ required_error: "blogId is required." }).refine((id) => isValidObjectId(id), {
      message: "Invalid blogId. Must be a valid MongoDB ObjectId.",
    }),
  }),
});
