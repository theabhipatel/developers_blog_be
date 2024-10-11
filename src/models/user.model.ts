import { Document, Schema, model } from "mongoose";

/* eslint-disable no-unused-vars */
export enum ERoles {
  ADMIN = "ADMIN",
  USER = "USER",
}
/* eslint-enable no-unused-vars */

interface IBaseUser {
  email: string;
  password: string;
  role: ERoles;
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
      required: true,
    },
    role: {
      type: String,
      enum: ERoles,
      default: ERoles.USER,
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
