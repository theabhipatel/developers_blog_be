import { EProvider } from "@/models/user.model";
import { object, string, enum as enum_ } from "zod";

const providerEnum = Object.values(EProvider) as [EProvider, ...EProvider[]];

export const singupSchema = object({
  body: object({
    firstName: string({ required_error: "firstName is required." }),
    lastName: string({ required_error: "lastName is required." }),
    email: string({ required_error: "email is required." }).email(),
    password: string({ required_error: "password is required." }).min(
      4,
      "password must be 4 char long."
    ),
  }),
});

export const signinSchema = object({
  body: object({
    email: string({ required_error: "email is required." }).email(),
    password: string({ required_error: "password is required." }),
  }),
});

export const oAuthSigninSchema = object({
  body: object({
    firstName: string({ required_error: "firstName is required." }),
    lastName: string({ required_error: "lastName is required." }),
    email: string({ required_error: "email is required." }).email(),
    profilePic: string({ required_error: "profilePic is required." }).url({
      message: "profilePic must be a url",
    }),
    provider: enum_(providerEnum, {
      required_error: "provider is required.",
    }),
  }),
});
