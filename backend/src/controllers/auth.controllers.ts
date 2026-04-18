import { Request, Response } from "express";
import * as authService from "../services/auth.services.js";

export async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;
    console.log("Register request:", { username, email, password });
    const auth = await authService.authRegister(username, email, password);
    console.log("✅ Register success:", auth);
    res.json(auth);
  } catch (err: any) {
    console.log("❌ Register error:", err.message);
    res.status(400).json({ message: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    console.log("email: ", email);
    console.log("password: ", password);
    const auth = await authService.authLogin(email, password);
    console.log("auth: ", auth);
    res.json(auth);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await authService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
}

export async function googleAuth(req: Request, res: Response) {
  console.log("reached googleAuth in auth.controller.ts")

    try {
    const client_id = process.env.GOOGLE_CLIENT_ID;
    const redirect_uri = "http://localhost:3000/api/users/auth/google/callback"; /*May need to get rid of users here */
    const scope = "openid email profile";

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;

    res.redirect(authUrl);
  } catch(error) {
    res.status(500).send("Error - Google Auth");
  }
}

export async function googleAuthCallback(req: Request, res: Response) {
  try {
    const code = req.query.code as string;

    const token = await authService.handleGoogleCallback(code);

    res.redirect(`http://localhost:5173/callback?token=${token}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error - Google Auth");
  }
}