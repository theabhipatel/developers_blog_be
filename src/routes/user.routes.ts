import { followUserHandler, getUserProfileByUserNameHandler } from "@/controllers/user.controller";
import { Router } from "express";

const userRouter = Router();

userRouter.get("/profile/:username", getUserProfileByUserNameHandler);
userRouter.post("/follow/:followingId", followUserHandler);

export default userRouter;
