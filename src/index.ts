import express from "express";
import { HOST_NAME, MONGO_DB_URL, PORT } from "./config";
import { blueLog } from "./utils/colorLogs";
import { connectDb } from "./utils/connectDb";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";
import helmet from "helmet";
import router from "./routes";
import { deserializeUser } from "./middlewares/deserializeUser";

const app = express();

/** ---> Registering middlewares. */
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

/** ---> Registering custom middlewares */
app.use(deserializeUser);

/** ---> Handling home route. */
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Welcome to the Developers Blog." });
});

/** ---> Handling all application's routes */
app.use("/api/v1", router);

/** ---> Handling not found (404) routes. */
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

/** ---> Handling global errors */
app.use(errorHandler);

app.listen(Number(PORT), HOST_NAME, () => {
  blueLog(`[::] Server is running at http://${HOST_NAME}:${PORT}`);
  connectDb(MONGO_DB_URL);
});
