import { Document, ObjectId } from "mongoose";

export interface IBlog extends Document {
  _id: ObjectId;
  user: {
    _id: ObjectId;
    username: string;
    createdAt: string;
    updatedAt: string;
    userProfile?: {
      _id: string;
      user: string;
      firstName: string;
      lastName: string;
      profilePic: string;
      isDeleted: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
  title: string;
  slug: string;
  thumbnail: string;
  status: string;
  reads: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
