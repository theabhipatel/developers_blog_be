import { Document, Schema, model } from "mongoose";

interface IBaseBlog {
  user: Schema.Types.ObjectId;
  title: string;
  slug: string;
  thumbnail: string;
  content: string;
  reads: string[];
  isDeleted: boolean;
}

interface IBlogSchema extends Document, IBaseBlog {}

const blogSchema = new Schema<IBlogSchema>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
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
