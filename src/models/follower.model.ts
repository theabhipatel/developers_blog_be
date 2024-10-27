import { Document, Schema, model } from "mongoose";

// follower: the user who is following someone else.
// following: the user being followed.

interface IBaseFollower {
  follower: Schema.Types.ObjectId;
  following: Schema.Types.ObjectId;
}

interface IFollowerSchema extends Document, IBaseFollower {}

const followerSchema = new Schema<IFollowerSchema>(
  {
    follower: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    following: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  },
  { timestamps: true }
);

const followerModel = model<IFollowerSchema>("follower", followerSchema);
export default followerModel;
