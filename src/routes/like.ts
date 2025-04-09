import express from "express";

import { isAuthenticated } from "../middlewares/auth";
import { likePost, unlikePost } from "../controllers/like";

const router = express.Router();

router.use(isAuthenticated);

router.post("/:id/like", likePost).post("/:id/unlike", unlikePost);

export default router;
