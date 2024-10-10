import express from "express";

const app = express();

const PORT = 3331;
const HOST_NAME = "127.0.0.1";

/** ---> Registering middlewares. */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

/** ---> Handling home route. */
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Welcome to the Developers Blog." });
});

/** ---> Handling not found (404) routes. */
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

app.listen(Number(PORT), HOST_NAME, () => {
  console.log(`[::] Server is running at http://${HOST_NAME}:${PORT}`);
});
