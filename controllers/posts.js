import db from "../db/index.js";
import moment from "moment";
import { uploadImages } from "./cloudinary.js";

export const getPosts = async (req, res) => {
  //we are only fetching posts from users who we follo
  try {
    const q = await db.query(
      //get everything from post but from users get id, name, profilePic
      "SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON(u.id= p.userId) JOIN relationships AS r ON (p.userId = r.followedUserId AND r.followerUserId=$1 OR p.userId=$1) ORDER BY p.createdAt DESC",
      [req.id]
    );
    return res.status(200).json({
      posts: q.rows,
    });
  } catch (e) {
    res.status(500).json("Something went wrong while fetching posts");
  }
};

export const addPost = async (req, res) => {
  const { descp, img } = req.body;
  console.log("img is", img);
  try {
    if (descp || img) {
      let imageUrl = "";
      let publicId = "";
      if (img) {
        try {
          const response = await uploadImages(img);
          publicId = response?.public_id;
          imageUrl = response?.url;
        } catch (e) {
          return res
            .status(500)
            .json("Something went wrong while uploading image");
        }
      }
      const q = await db.query(
        "INSERT INTO posts(descp, img, userId, publicId, createdAt) VALUES($1, $2, $3, $4 , $5) RETURNING *",
        [
          descp,
          imageUrl || null,
          req.id,
          publicId || null,
          moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        ]
      );

      return res.status(200).json({
        post: q.rows[0],
        message: "Post added successfully",
      });
    } else {
      return res.status(400).json({ message: "Please enter all fields" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json("Something went wrong while adding post");
  }
};
