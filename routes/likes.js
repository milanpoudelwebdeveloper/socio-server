import express from "express";
import { deleteLike, getLikes, postLike } from "../controllers/likes.js";
import { checkTokenValidity } from "../middlwares/checkTokenValidity.js";

const router = express.Router();

router.get("/", checkTokenValidity, getLikes);
router.post("/", checkTokenValidity, postLike);
router.delete("/", checkTokenValidity, deleteLike);

export default router;
