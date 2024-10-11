import colors from "colors";

/* eslint-disable */
export const blueLog = (param: any) => {
  console.log(colors.blue.bold(param));
};

export const errorLog = (param: any) => {
  console.log(colors.magenta.bold("Error :\n"), colors.dim(param));
};
