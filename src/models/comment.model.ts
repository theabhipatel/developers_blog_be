import { Document, Schema, model } from "mongoose";

// user: the user who has commented on the blog.
// blog: the blog being commented.

interface IBaseComment {
  user: Schema.Types.ObjectId;
  blog: Schema.Types.ObjectId;
  content: string;
}

interface ICommentSchema extends Document, IBaseComment {}

const commentSchema = new Schema<ICommentSchema>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    blog: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "blog",
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/** ---> Indexing user's comment. */
commentSchema.index({ user: 1, blog: 1 });

const commentModel = model<ICommentSchema>("comment", commentSchema);
export default commentModel;
