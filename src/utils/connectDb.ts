import mongoose from "mongoose";
import { blueLog, errorLog } from "./colorLogs";
import colors from "colors";

export const connectDb = async (dbUrl: string) => {
  try {
    await mongoose.connect(dbUrl);
    blueLog("[::] Database connect successfully...");
  } catch (error) {
    console.log(colors.red("!!! Database not connected.")); //eslint-disable-line
    errorLog(error);
  }
};
