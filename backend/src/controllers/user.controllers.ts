import { Request, Response } from "express";
import * as userService from "../services/user.services.js";
import { verifyToken } from "../lib/jwt.js"

export async function findUsers(req: Request, res: Response) {
  try {
    const { username } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    const decoded = verifyToken(token);
    const self = decoded.id
    const users = await userService.findUsers(username, self);
    res.json(users);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function getFriends(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    const decoded = verifyToken(token);
    const self = decoded.id
    const users = await userService.getFriends(self);
    res.json(users);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function friendReq(req: Request, res: Response) {
  try {
    const { recipient, isAdding } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    const decoded = verifyToken(token);
    const sender = decoded.id
    const users = await userService.friendReq(recipient, sender, isAdding);
    res.json(users);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const { id } = req.body;
    const user = await userService.getUser(id);
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function addFriend(req: Request, res: Response) {
  try {
    const { senderId, accepted  } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    const decoded = verifyToken(token);
    const recipient = decoded.id
    const users = await userService.addFriend(recipient, senderId, accepted);
    res.json(users);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function getNotifs(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    const decoded = verifyToken(token);
    const user = decoded.id
    const users = await userService.getNotifs(user);
    res.json(users);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
