import { EBlogStatus } from "@/models/blog.model";
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
