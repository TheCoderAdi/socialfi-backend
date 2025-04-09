import express from "express";
import { createPost, deletePost, getPosts, getSinglePost } from "../controllers/post";
import { isAuthenticated } from "../middlewares/auth";
import { postImage } from "../middlewares/multer";

const router = express.Router();

router.use(isAuthenticated);
router
  .get("/", getPosts)
  .post("/", postImage, createPost)
  .get("/:id", getSinglePost)
  .delete("/:id", deletePost);

export default router;
