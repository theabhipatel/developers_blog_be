import { Router } from "express";
import authRouter from "./auth.routes";
import blogRouter from "./blog.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/blogs", blogRouter);

export default router;
