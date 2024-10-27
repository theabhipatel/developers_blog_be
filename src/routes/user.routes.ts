import {
  followUserHandler,
  getUserProfileByUserNameHandler,
  unFollowUserHandler,
} from "@/controllers/user.controller";
import { authorize } from "@/middlewares/authorize";
import { ERoles } from "@/models/user.model";
import { Router } from "express";

const userRouter = Router();

// [] TODO : Have to create request validation schema
userRouter.get("/profile/:username", getUserProfileByUserNameHandler);
userRouter.post("/follow/:followingId", authorize([ERoles.ADMIN, ERoles.USER]), followUserHandler);
userRouter.delete(
  "/unfollow/:followingId",
  authorize([ERoles.ADMIN, ERoles.USER]),
  unFollowUserHandler
);

export default userRouter;
