import express, { Router } from "express";
import cors from "cors";
import 'dotenv/config'
import { closeDatabaseConnection, connectToDatabase } from "./lib/connect.js";
import authRoutes from "./routes/auth.routes.js";
import songsRoutes from "./routes/songs.routes.js";
import indexRoutes from "./routes/index.routes.js";
import userRoutes from "./routes/user.routes.js"
import reviewsRoutes from "./routes/review.routes.js"
import uploadRouter from "./routes/uploadRouter.js";
import rateLimit from "express-rate-limit";
const app = express();
const PORT = process.env.PORT ? process.env.PORT : 3000;

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 400, // Limit each IP to 180 requests per `window` (here, per 5 minutes).
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 60,
})
app.use(limiter);

async function startServer() {
  try {
    console.log("attempting to connect to db");
    await connectToDatabase();
    console.log("connected to db");
    

    app.use(cors());
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ limit: "10mb", extended: true }));

    app.use((req, res, next) => {
      console.log("➡️ REQUEST:", req.method, req.url);
      next();
    });

    app.use("/api", uploadRouter);
    app.use("/api/users", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/reviews", reviewsRoutes);
    app.use("/api/songs", songsRoutes);
    app.use("/api", indexRoutes);

    app.listen(PORT, () => {
      console.log(`Startune server listening on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
}

startServer();

// closing the server
process.on("SIGINT", async () => {
  console.log("Shutting down server.");
  await closeDatabaseConnection();
  process.exit();
});