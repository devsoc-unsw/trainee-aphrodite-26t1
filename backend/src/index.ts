import express, { Router } from "express";
import cors from "cors";
import 'dotenv/config'
import rateLimit from "express-rate-limit";
import router from "./routes/index.routes.js";

const app = express();
const PORT = process.env.PORT ? process.env.PORT : 3000;

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
//   standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
//   ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
//   // store: ... , // Redis, Memcached, etc. See below.
// })
// app.use(limiter);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);

app.get("/", (req, res) => {
  res.json({ message: "Startune backend is running" });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

