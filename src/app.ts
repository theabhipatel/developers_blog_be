import express from "express";
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

export default app;
