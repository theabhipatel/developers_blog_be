import { Document, Schema, model } from "mongoose";

/* eslint-disable no-unused-vars */
export enum ERoles {
  ADMIN = "ADMIN",
  USER = "USER",
}
export enum EProvider {
  GOOGLE = "google",
  GITHUB = "github",
  CREDENTIALS = "credentials",
}
/* eslint-enable no-unused-vars */

interface IBaseUser {
  email: string;
  password: string;
  role: ERoles;
  provider: EProvider;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
}

interface IUserSchema extends Document, IBaseUser {}

const userSchema = new Schema<IUserSchema>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ERoles,
      default: ERoles.USER,
    },
    provider: {
      type: String,
      enum: EProvider,
      default: EProvider.CREDENTIALS,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userModel = model<IUserSchema>("user", userSchema);
export default userModel;
