import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { usersCollection } from "../lib/connect.js";
import { ErrorMap } from "../constants/errors.js";

const JWT_KEY = process.env.JWT_KEY!;

function isValidUsername(name: string): string | boolean {
  if (name.length > 100) {
    return ErrorMap["NAME_TOO_LONG"];
  }

  if (name.length < 1) {
    return ErrorMap["NAME_TOO_SHORT"];
  }

  return true;
}

async function isValidEmail(
  email: string,
  isRegister?: boolean
): Promise<string | boolean> {
  if (email.length > 50) return ErrorMap["EMAIL_TOO_LONG"];
  if (email.length < 1) return ErrorMap["EMAIL_TOO_SHORT"];

  const pattern = /[a-zA-Z0-9_\-]/;
  if (!pattern.test(email)) {
    return ErrorMap["EMAIL_SUFFIX"];
  }

  if (isRegister) {
    const existing = await usersCollection.findOne({ email });
    if (existing) return ErrorMap["EMAIL_ALREADY_EXISTS"];
  }

  return true;
}

function isValidPassword(password: string): string | boolean {
  if (password.length < 6) {
    return ErrorMap["PASSWORD_LENGTH"];
  }

  const numPattern = /\d/;
  const upperPattern = /[A-Z]/;
  const lowerPattern = /[a-z]/;
  if (
    !numPattern.test(password) ||
    !upperPattern.test(password) ||
    !lowerPattern.test(password)
  ) {
    return ErrorMap["PASSWORD_SYMBOLS"];
  }

  return true;
}

export async function authRegister(name: string, email: string, password: string) {

  const nameCheck = isValidUsername(name);
if (nameCheck !== true) throw new Error(nameCheck as string);

const emailCheck = await isValidEmail(email, true);
if (emailCheck !== true) throw new Error(emailCheck as string);

const passwordCheck = isValidPassword(password);
if (passwordCheck !== true) throw new Error(passwordCheck as string);

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = {
    username: name,
    email: email,
    password: hashedPassword,  
    friends: [],
    requests: [],
  };

  const result = await usersCollection.insertOne(user);

  // Sign JWT with the MongoDB _id
  const token = jwt.sign(
    { id: result.insertedId, email },
    JWT_KEY,
    { expiresIn: "7d" }
  );

  return { token };
}


/**
 * Logs in an existing user and returns a session
 */
export async function authLogin(email: string, password: string) {
  // Get user from MongoDB
  const user = await usersCollection.findOne({ email });

  if (!user) {
    throw new Error(`${ErrorMap["EMAIL_DOES_NOT_EXIST"]}`);
  }
  if (!user.password) {
    throw new Error("This user does not use password login (Google User) ");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error(ErrorMap["PASSWORD_INCORRECT"]);
  }

  const token = jwt.sign(
    { id: user._id, email },
    JWT_KEY,
    { expiresIn: "7d" }
  );

  return { token };
}

export async function getUsers() {
  return usersCollection.find().toArray();
}

export async function handleGoogleCallback(code: string) {
  console.log("reached handleGoogleCallback in auth.services.ts")
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
    throw new Error("Failed to fetch Google user");
  }

  let user = await usersCollection.findOne({ email: googleUser.email })

  let username = googleUser.name
  let usernameTaken = await usersCollection.findOne({ username })
  let i = 1

  while(usernameTaken) {
    username = googleUser.name + i
    usernameTaken = await usersCollection.findOne({ username })
    i++;
  }

  if (!user) {
    console.log(googleUser)
    const result = await usersCollection.insertOne({
      username: username,
      email: googleUser.email,
      googleId: googleUser.sub,
      friends: [],
      requests: [],
    });
    user = {
      _id: result.insertedId,
      username,
      email: googleUser.email,
      googleId: googleUser.sub,
      friends: [],
      requests: [],
    };
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    JWT_KEY,
    { expiresIn: "5d" }
  );

  return { token };
}