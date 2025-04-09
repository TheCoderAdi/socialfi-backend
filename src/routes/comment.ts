import express from "express";
import { addComment, getComments } from "../controllers/comment";
import { isAuthenticated } from "../middlewares/auth";

const router = express.Router();

router.use(isAuthenticated);
router.get("/:id/comments", getComments).post("/:id/comments", addComment);

export default router;
