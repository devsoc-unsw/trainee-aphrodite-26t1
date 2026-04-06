import { Router } from "express";
import { connectDB } from "../database/connect.js";

const router: Router = Router();

router.get("/", async (req, res) => {
  try {
      const db = await connectDB();
      const users = await db.collection("users").find().toArray();
      res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
});

export default router;