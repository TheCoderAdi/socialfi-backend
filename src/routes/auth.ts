import express from "express";
import { profilePicture } from "../middlewares/multer";
import { login, logout, register } from "../controllers/auth";
import { authRateLimiter } from "../middlewares/rateLimiter";

const router = express.Router();

router.post("/register", authRateLimiter, profilePicture, register);
router.post("/login", authRateLimiter, login);
router.get("/logout", logout);

export default router;
