import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likesRoutes from "./routes/likes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

//middlwares
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

//gives us req.body and converts it to standard javascript object
app.use(express.json());
app.use(cors());
app.use(cookieParser());
//routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likesRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
