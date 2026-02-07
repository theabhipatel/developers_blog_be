/* eslint-disable */

/**
 * local server entry file, for local development
 */
import app from "./app";
import { HOST_NAME, MONGO_DB_URL } from "./config";
import { blueLog } from "./utils/colorLogs";
import { connectDb } from "./utils/connectDb";

/**
 * start server with port
 */
const PORT = process.env.PORT || 3001;

// const server = app.listen(PORT, () => {
//   console.log(`Server ready on port ${PORT}`);
// });

const server = app.listen(Number(PORT), () => {
  blueLog(`[::] Server is running at http://${HOST_NAME}:${PORT}`);
  connectDb(MONGO_DB_URL);
});

/**
 * close server
 */
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
