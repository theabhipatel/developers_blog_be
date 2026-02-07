import { Document, Schema, model } from "mongoose";

// user: the user who has liked the blog.
// blog: the blog being liked.

interface IBaseLike {
  user: Schema.Types.ObjectId;
  blog: Schema.Types.ObjectId;
}

interface ILikeSchema extends Document, IBaseLike {}

const likeSchema = new Schema<ILikeSchema>(
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
  },
  { timestamps: true }
);

/** ---> Indexing user's like with uniqueness. */
likeSchema.index({ user: 1, blog: 1 }, { unique: true });

const likeModel = model<ILikeSchema>("like", likeSchema);
export default likeModel;
