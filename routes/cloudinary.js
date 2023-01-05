import express from "express";
import { deleteImage, uploadImages } from "../controllers/cloudinary.js";

const router = express.Router();

router.post("/", uploadImages);
router.delete("/", deleteImage);

export default router;
