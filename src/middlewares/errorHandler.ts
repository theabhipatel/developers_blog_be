import { ErrorRequestHandler } from "express";
import colors from "colors";
import { errorLog } from "@/utils/colorLogs";

/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  try {
    console.log(colors.blue("---------> catched Error <----------")); //eslint-disable-line
    errorLog(err);
    console.log(colors.blue("---------> catched Error End! <-------")); // eslint-disable-line
    res.status(500).json({ success: false, message: "Something went wrong." });
  } catch (error) {
    errorLog(error);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};
