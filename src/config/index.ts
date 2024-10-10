import dotenv from "dotenv";
dotenv.config();

/** ---> Exporting all environment variables. */

export const PORT = process.env.PORT || 3331;
export const HOST_NAME = process.env.HOST_NAME || "127.0.0.1";
