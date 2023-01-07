import express from "express";
import { getComments, postComment } from "../controllers/comment.js";
import { checkTokenValidity } from "../middlwares/checkTokenValidity.js";
const router = express.Router();

router.get("/", checkTokenValidity, getComments);
router.post("/", checkTokenValidity, postComment);

export default router;
