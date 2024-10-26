import { getUserByUserName } from "@/controllers/user.controller";
import { Router } from "express";

const userRouter = Router();

userRouter.get("/profile/:username", getUserByUserName);

export default userRouter;
