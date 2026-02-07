import { Document, Schema, model } from "mongoose";

interface IBaseUserProfile {
  user: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  profilePic: string;
  bio: string;
  readLater: Schema.Types.ObjectId[];
  isDeleted: boolean;
}

interface IUserProfileSchema extends Document, IBaseUserProfile {}

const userProfileSchema = new Schema<IUserProfileSchema>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
      ref: "user",
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
    },
    bio: {
      type: String,
    },
    readLater: {
      type: [Schema.Types.ObjectId],
      ref: "blog",
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userProfileModel = model<IUserProfileSchema>("userProfile", userProfileSchema);
export default userProfileModel;
