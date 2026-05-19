
import express, { Router } from "express";
import * as songsController from "../controllers/songs.controllers.js"


import { authMiddleware, optionalAuthMiddleware } from "../middleware/middleware.js";

const router: Router = express.Router();
console.log("✅ song.routes loaded");

router.get("/", songsController.getSongs);
router.get("/:songId", optionalAuthMiddleware, songsController.getSongById);
router.post("/:songId/like", authMiddleware, songsController.toggleLike);

export default router;