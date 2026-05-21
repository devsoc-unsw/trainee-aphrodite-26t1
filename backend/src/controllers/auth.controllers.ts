import { Request, Response } from "express";
import * as authService from "../services/auth.services.js";
import * as userService from "../services/user.services.js";
import { verifyToken } from "../lib/jwt.js";

export async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;
    const auth = await authService.authRegister(username, email, password);
    res.json(auth);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const auth = await authService.authLogin(email, password);
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
    const redirect_uri = process.env.BACKEND_URL + "/api/users/auth/google/callback"; /*May need to get rid of users here */
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

    const { token } = await authService.handleGoogleCallback(code);

    res.redirect(`${process.env.FRONTEND_URL}/callback?token=${token}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error - Google Auth");
  }
}

export async function spotifyAuth(req: Request, res: Response) {
  console.log("reached spotifyAuth in auth.controller.ts")
  try {
    const userToken = req.query.token as string;
    if (!userToken) return res.status(401).json({ message: "No token provided in spotifyAuth" });
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const redirect_uri = process.env.BACKEND_URL + "/api/users/auth/spotify/callback";
    const scope = "user-top-read user-read-recently-played playlist-read-private playlist-read-collaborative";
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=${encodeURIComponent(scope)}&show_dialog=true&state=${userToken}`;
    res.redirect(authUrl);
  } catch(error) {
    res.status(500).send("Error - Spotify Auth");
  }
}

export async function spotifyAuthCallback(req: Request, res: Response) {
  try {
    const code = req.query.code as string;
    const userToken = req.query.state as string; 
    if (!userToken) {
        return res.status(401).json({ message: "No token provided in authcallback" });
    }
    const decoded = verifyToken(userToken);
    const userId = decoded.id
    const username = await userService.getUser(userId)
    if (!username) {
      return res.status(404).json({ message: "User not found" });
    }
    await authService.handleSpotifyCallback(code, userId);
    res.redirect(`${process.env.FRONTEND_URL}/settings`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error - Google Auth");
  }
}
