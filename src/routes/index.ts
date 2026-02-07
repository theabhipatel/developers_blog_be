import { Router } from "express";
import authRouter from "./auth.routes";
import blogRouter from "./blog.routes";
import userRouter from "./user.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/blogs", blogRouter);
router.use("/user", userRouter);

export default router;
