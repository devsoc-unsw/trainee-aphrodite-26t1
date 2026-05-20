import express, { Router } from "express";
import * as userController from "../controllers/user.controllers.js"
const router: Router = express.Router();

console.log("user routes loaded");
// Finds a user by username
router.post("/findUsers", userController.findUsers);
router.post("/getFriends", userController.getFriends);
router.get("/:username/friendCount", userController.getFriendCount);
router.post("/friendReq", userController.friendReq);
router.post("/getUser", userController.getUser);
router.post("/addFriend", userController.addFriend);
router.get("/getNotifs", userController.getNotifs);
router.get("/getCurrUser", userController.getCurrUser);
router.get("/:username/top-tracks", userController.getFavSongs);
router.get("/:username/top-artist", userController.getFavArtist);
router.get("/:username/listening-age", userController.getListeningAge);
router.post("/:username/playlists", userController.updateUserPlaylists);
router.get("/:username/fetchPlaylists", userController.fetchUserPlaylists);
router.post("/makePrivate", userController.makePrivate);
router.post("/hidePlaylists", userController.hidePlaylists);
router.get("/:username/isPrivate", userController.isPrivate);
router.get("/:username/showPlaylist", userController.showPlaylist);
router.post("/updateBanner", userController.updateBanner);
router.post("/updateAvatar", userController.updateAvatar);
router.get("/:username/fetchBanner", userController.fetchBanner);
router.get("/:username/fetchAvatar", userController.fetchAvatar);
router.post("/updateDescription", userController.updateDescription);
router.get("/:username/fetchDescription", userController.fetchDescription);
router.get("/:username/playlists/:playlistId/tracks", userController.fetchPlaylistTracks);
export default router;