import {
  followUserHandler,
  getUserProfileByUserNameHandler,
  unFollowUserHandler,
  updateUserProfileHandler,
} from "@/controllers/user.controller";
import { authorize } from "@/middlewares/authorize";
import { validate } from "@/middlewares/validate";
import { ERoles } from "@/models/user.model";
import {
  followUnfollowUserSchema,
  getUserProfileByUserNameSchema,
  updateUserProfileSchema,
} from "@/validation/user";
import { Router } from "express";

const userRouter = Router();

userRouter.patch(
  "/profile/update",
  authorize([ERoles.ADMIN, ERoles.USER]),
  validate(updateUserProfileSchema),
  updateUserProfileHandler
);
userRouter.get(
  "/profile/:username",
  validate(getUserProfileByUserNameSchema),
  getUserProfileByUserNameHandler
);
// [::] TODO : We can follow unfollow user using only one route.
userRouter.post(
  "/follow/:followingId",
  authorize([ERoles.ADMIN, ERoles.USER]),
  validate(followUnfollowUserSchema),
  followUserHandler
);
userRouter.delete(
  "/unfollow/:followingId",
  authorize([ERoles.ADMIN, ERoles.USER]),
  validate(followUnfollowUserSchema),
  unFollowUserHandler
);

export default userRouter;
