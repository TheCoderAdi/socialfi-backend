import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import {
  deleteProfile,
  followUser,
  getFollowers,
  getFollowings,
  getUserProfile,
  unfollowUser,
  updateProfile,
} from "../controllers/user";
import { files } from "../middlewares/multer";

const router = express.Router();

router
  .get("/:id", getUserProfile)
  .put("/:id", isAuthenticated, files, updateProfile)
  .get("/:id/followers", isAuthenticated, getFollowers)
  .get("/:id/following", isAuthenticated, getFollowings)
  .post("/:id/follow", isAuthenticated, followUser)
  .post("/:id/unfollow", isAuthenticated, unfollowUser)
  .delete("/:id", isAuthenticated, deleteProfile);

export default router;
