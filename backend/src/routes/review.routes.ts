import { Router } from "express"
import { authMiddleware, optionalAuthMiddleware } from "../middleware/middleware.js";
import * as reviewsController from "../controllers/review.controllers.js"

const router: Router = Router();

router.get("/user/:username", authMiddleware, reviewsController.getAllOwnedReviews);
router.get("/:songId", optionalAuthMiddleware, reviewsController.getReviews);
router.post("/:songId", authMiddleware, reviewsController.postReview);
router.get("/:songId/me", authMiddleware, reviewsController.getOwnReview);
router.delete("/:songId", authMiddleware, reviewsController.deleteReviewEndpoint);
router.post("/review/:reviewId/like", authMiddleware, reviewsController.toggleLike);

export default router;