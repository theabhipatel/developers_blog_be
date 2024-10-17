import { Document, Schema, model } from "mongoose";

interface IBaseUserProfile {
  user: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  profilePic: string;
  bio: string;
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userProfileModel = model<IUserProfileSchema>("userProfile", userProfileSchema);
export default userProfileModel;
