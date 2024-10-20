import { oAuthSigninHandler, signinHandler, singupHandler } from "@/controllers/auth.controller";
import { validate } from "@/middlewares/validate";
import { singupSchema } from "@/validation/auth";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/signup", validate(singupSchema), singupHandler);
authRouter.post("/signin", signinHandler);
authRouter.post("/oauth-signin", oAuthSigninHandler);

export default authRouter;
