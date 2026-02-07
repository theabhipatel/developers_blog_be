import { Document, Schema, model } from "mongoose";

// blog: the blog being read.
// userIp: the user who has read the blog.

interface IBaseBlogRead {
  blog: Schema.Types.ObjectId;
  userIp: string;
}

interface IBlogReadSchema extends Document, IBaseBlogRead {}

const blogReadSchema = new Schema<IBlogReadSchema>(
  {
    blog: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "blog",
    },
    userIp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/** ---> Indexing user's reads on based on blog and userIp. */
blogReadSchema.index({ userIp: 1, blog: 1 }, { unique: true });

const blogReadModel = model<IBlogReadSchema>("blogRead", blogReadSchema);
export default blogReadModel;
