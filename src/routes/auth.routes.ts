import { singupHandler } from "@/controllers/auth.controller";
import { Router } from "express";

const authRouter = Router();

authRouter.get("/signup", singupHandler);

export default authRouter;
