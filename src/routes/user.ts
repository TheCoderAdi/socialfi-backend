import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import {
  followUser,
  getFollowers,
  getFollowings,
  getUserProfile,
  unfollowUser,
  updateProfile,
} from "../controllers/user";
import { profilePicture } from "../middlewares/multer";

const router = express.Router();

router
  .get("/:id", getUserProfile)
  .put("/:id", isAuthenticated, profilePicture, updateProfile)
  .get("/:id/followers", isAuthenticated, getFollowers)
  .get("/:id/following", isAuthenticated, getFollowings)
  .post("/:id/follow", isAuthenticated, followUser)
  .post("/:id/unfollow", isAuthenticated, unfollowUser);

export default router;
