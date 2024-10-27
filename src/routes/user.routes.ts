import { getUserProfileByUserNameHandler } from "@/controllers/user.controller";
import { Router } from "express";

const userRouter = Router();

userRouter.get("/profile/:username", getUserProfileByUserNameHandler);

export default userRouter;
