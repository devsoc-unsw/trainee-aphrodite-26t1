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

export async function getFriendCount(req: Request, res: Response) {
  try {
    const user = req.params.username

    if (!user) {
        return res.status(401).json({ message: "No user specified" });
    }
    const users = await userService.getFriendCount(user as string);
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

export async function getCurrUser(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    const decoded = verifyToken(token);
    const recipient = decoded.id
    const user = await userService.getUser(recipient);
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function getFavSongs(req: Request, res: Response) {
  try {
    const tracks = await userService.getFavSongs(req.params.username as string);
    res.json(tracks);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function getFavArtist(req: Request, res: Response) {
  try {
    const tracks = await userService.getFavArtist(req.params.username as string);
    res.json(tracks);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function getListeningAge(req: Request, res: Response) {
  try {
    const tracks = await userService.getListeningAge(req.params.username as string);
    res.json(tracks);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
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

export async function makePrivate(req: Request, res: Response) {
  try {
    const { update } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    const decoded = verifyToken(token);
    const user = decoded.id
    const result = await userService.makePrivate(user, update);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function isPrivate(req: Request, res: Response) {
  try {
    const result = await userService.isPrivate(req.params.username as string);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function updateBanner(req: Request, res: Response) {
  try {
    const { file } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    const decoded = verifyToken(token);
    const user = decoded.id
    const result = await userService.updateBanner(user, file);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function updateAvatar(req: Request, res: Response) {
  try {
    const { file } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    const decoded = verifyToken(token);
    const user = decoded.id
    const result = await userService.updateAvatar(user, file);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function fetchAvatar(req: Request, res: Response) {
  try {
    const result = await userService.fetchAvatar(req.params.username as string);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function fetchBanner(req: Request, res: Response) {
  try {
    const result = await userService.fetchBanner(req.params.username as string);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function updateDescription(req: Request, res: Response) {
  try {
    const { description } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    const decoded = verifyToken(token);
    const user = decoded.id
    const result = await userService.updateDescription(user, description);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function fetchDescription(req: Request, res: Response) {
  try {
    const result = await userService.fetchDescription(req.params.username as string);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}