import express from "express";
import { getImage } from "../controllers/image";

const router = express.Router();

router.get("/uploads/:filename", getImage);

export default router;
