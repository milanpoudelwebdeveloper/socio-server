import express from "express";
import { getUsers } from "../controllers/users.js";
import { checkTokenValidity } from "../middlwares/checkTokenValidity.js";

const router = express.Router();

router.get("/", checkTokenValidity, getUsers);

export default router;
