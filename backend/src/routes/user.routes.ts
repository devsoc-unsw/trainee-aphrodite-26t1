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
router.get("/getNotifs", userController.getNotifs);
router.get("/getCurrUser", userController.getCurrUser);
router.get("/:username/top-tracks", userController.getFavSongs);
router.get("/:username/top-artist", userController.getFavArtist);
router.get("/:username/listening-age", userController.getListeningAge);
router.post("/makePrivate", userController.makePrivate);
router.get("/:username/isPrivate", userController.isPrivate);
router.post("/updateBanner", userController.updateBanner);
router.get("/:username/fetchBanner", userController.fetchBanner);
export default router;