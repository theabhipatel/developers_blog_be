import { Document, Schema, model } from "mongoose";

/* eslint-disable no-unused-vars */
export enum EBlogStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}
/* eslint-enable no-unused-vars */

interface IBaseBlog {
  user: Schema.Types.ObjectId;
  title: string;
  slug: string;
  thumbnail: string;
  content: string;
  status: EBlogStatus;
  reads: string[];
  isDeleted: boolean;
}

interface IBlogSchema extends Document, IBaseBlog {}

const blogSchema = new Schema<IBlogSchema>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: EBlogStatus,
      default: EBlogStatus.DRAFT,
    },
    reads: {
      type: [String],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const blogModel = model<IBlogSchema>("blog", blogSchema);
export default blogModel;
