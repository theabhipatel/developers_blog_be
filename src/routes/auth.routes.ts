import { oAuthSigninHandler, signinHandler, singupHandler } from "@/controllers/auth.controller";
import { validate } from "@/middlewares/validate";
import { signinSchema, singupSchema } from "@/validation/auth";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/signup", validate(singupSchema), singupHandler);
authRouter.post("/signin", validate(signinSchema), signinHandler);
authRouter.post("/oauth-signin", oAuthSigninHandler);

export default authRouter;
