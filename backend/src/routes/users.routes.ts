import { Router } from "express";
import { connectDB } from "../database/connect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authorise } from "../middleware/auth.js";

const router: Router = Router();

router.get("/", authorise, async (req, res) => {
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

    const { email, password } = req.body

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

router.get("/auth/google", async (req, res) => {
  try {
    const client_id = process.env.GOOGLE_CLIENT_ID; 
    const redirect_uri = "http://localhost:3000/api/users/auth/google/callback"; /*May need to get rid of users here */
    const scope = "openid email profile";

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;

    res.redirect(authUrl);
  } catch(error) {
    res.status(500).send("Error - Google Auth");
  }
})

router.get("/auth/google/callback", async( req, res ) => {
  const code = req.query.code as string;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: "http://localhost:3000/api/users/auth/google/callback",
      grant_type: "authorization_code",
    }),
  });
  
  const tokens = await tokenRes.json();
  console.log("tokens:", tokens);

  // Get user info
  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  const googleUser = await userRes.json();

  if (!googleUser) {
    res.status(500).send("Error - Google Auth");
    res.redirect("http://localhost:5173")
  }

  const db = await connectDB();
  let user = await db.collection("users").findOne({ email: googleUser.email })

  let username = googleUser.name
  let usernameTaken = await db.collection("users").findOne({ username })
  let i = 1

  while(usernameTaken) {
    username = googleUser.name + i
    usernameTaken = await db.collection("users").findOne({ username })
    i++;
  }

  if (!user) {
    console.log(googleUser)
    const result = await db.collection("users").insertOne({
      username: googleUser.name,
      email: googleUser.email,
      googleId: googleUser.sub,
    });
    user = { _id: result.insertedId, email: googleUser.email }
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_KEY!,
    { expiresIn: "5d" }
  );

  res.redirect(`http://localhost:5173/callback?token=${token}`);

})

export default router;