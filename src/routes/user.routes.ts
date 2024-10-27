import {
  followUserHandler,
  getUserProfileByUserNameHandler,
  unFollowUserHandler,
} from "@/controllers/user.controller";
import { Router } from "express";

const userRouter = Router();

// [] TODO : Have to create request validation schema
userRouter.get("/profile/:username", getUserProfileByUserNameHandler);
userRouter.post("/follow/:followingId", followUserHandler);
userRouter.delete("/unfollow/:followingId", unFollowUserHandler);

export default userRouter;
