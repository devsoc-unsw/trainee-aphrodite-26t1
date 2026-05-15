import express from "express";
import * as userController from "../controllers/user.controllers.js"
const router = express.Router();

console.log("user routes loaded");
// Finds a user by username
router.post("/findUsers", userController.findUsers);
router.post("/getFriends", userController.getFriends);
router.post("/friendReq", userController.friendReq);
router.post("/getUser", userController.getUser);
router.post("/addFriend", userController.addFriend);
router.post("/getNotifs", userController.getNotifs);
router.post("/getCurrUser", userController.getCurrUser);
router.get("/:username/top-tracks", userController.getFavSongs);
router.get("/:username/top-artist", userController.getFavArtist);
router.get("/:username/listening-age", userController.getListeningAge);
export default router;