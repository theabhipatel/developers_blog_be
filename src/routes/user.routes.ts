import { getUserProfileByUserName } from "@/controllers/user.controller";
import { Router } from "express";

const userRouter = Router();

userRouter.get("/profile/:username", getUserProfileByUserName);

export default userRouter;
