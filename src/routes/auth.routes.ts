import { oAuthSigninHandler, signinHandler, singupHandler } from "@/controllers/auth.controller";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/signup", singupHandler);
authRouter.post("/signin", signinHandler);
authRouter.post("/oauth/signin", oAuthSigninHandler);

export default authRouter;
