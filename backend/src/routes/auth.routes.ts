import express, { NextFunction } from "express";
import * as authController from "../controllers/auth.controllers.js"
import { authMiddleware } from "../middleware/middleware.js";


const router = express.Router();
console.log("✅ auth.routes loaded");

router.get("/", authMiddleware, authController.getUsers);

// Registers and logs in a new user and returns a token
//router.post("/auth/register", authController.register);
router.post("/auth/register", authController.register);

// Logs in an existing user and returns a token
router.post("/auth/login", authController.login);

router.get("/auth/google", authController.googleAuth);

router.get("/auth/google/callback", authController.googleAuthCallback);


export default router;