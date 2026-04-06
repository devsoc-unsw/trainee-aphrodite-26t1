import { Router } from "express";
import { connectDB } from "../database/connect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const users = await db.collection("users").find().toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
});

router.post("/", async (req, res) => {
  try {

    const db = await connectDB();
    const { username, email, password } = req.body
    const usernameValid = await db.collection("users").findOne({ username })
    const emailValid = await db.collection("users").findOne({ email })
    if (usernameValid) {
      return res.status(409).json({ message: "Username has already been taken"})
    }

    if (emailValid) {
      return res.status(409).json({ message: "Email has already been registered"})
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newAccount = { username, email, password: hashedPassword };
    const result = await db.collection("users").insertOne(newAccount)

    const token = jwt.sign(
      { id: username, email: email },
      process.env.JWT_KEY!,
      { expiresIn: "5d" }
    );

    res.status(201).json({ token });
  } catch (error) {

    res.status(500).json({ message: "Failed to create user", error: String(error) })
  }
})

router.post("/login", async (req, res) => {
  try {

    const db = await connectDB();
    const { username, email, password } = req.body

    const user = await db.collection("users").findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_KEY!,
      { expiresIn: "5d" }
    );

    res.status(201).json({ token });
  } catch (error) {

    res.status(500).json({ message: "Failed to login", error: String(error) })
  }
})


export default router;