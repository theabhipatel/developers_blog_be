import { isValidObjectId } from "mongoose";
import { object, string } from "zod";

export const updateUserProfileSchema = object({
  body: object({
    firstName: string().optional(),
    lastName: string().optional(),
    bio: string().min(10, "bio must be 10 char long.").optional(),
    profilePic: string().url("profilePic must be a valid url").optional(),
  }),
});

export const getUserProfileByUserNameSchema = object({
  params: object({
    username: string({ required_error: "username is required." }),
  }),
});

export const followUnfollowUserSchema = object({
  params: object({
    followingId: string({ required_error: "followingId is required." }).refine(
      (id) => isValidObjectId(id),
      {
        message: "Invalid followingId. Must be a valid MongoDB ObjectId.",
      }
    ),
  }),
});
