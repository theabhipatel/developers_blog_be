import { object, string } from "zod";

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
