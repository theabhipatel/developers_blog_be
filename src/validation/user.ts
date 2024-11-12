import { isValidObjectId } from "mongoose";
import { object, string } from "zod";

export const updateUserProfileSchema = object({
  body: object({
    firstName: string({ required_error: "firstName is required." }),
    lastName: string({ required_error: "lastName is required." }),
    bio: string({ required_error: "bio is required." }).min(10, "bio must be 10 char long."),
    profilePic: string({ required_error: "profilePic is required." }).url(
      "profilePic must be a valid url"
    ),
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
