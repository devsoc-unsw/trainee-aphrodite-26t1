
import express from "express";
import * as songsController from "../controllers/songs.controllers.js"


const router = express.Router();
console.log("✅ song.routes loaded");

router.get("/songs/:songId", songsController.getSongById);

export default router;