import express from "express";
import { getPosts, addPost } from "../controllers/posts.js";
import { checkTokenValidity } from "../middlwares/checkTokenValidity.js";

const router = express.Router();

router.get("/", checkTokenValidity, getPosts);
router.post("/", checkTokenValidity, addPost);

export default router;
