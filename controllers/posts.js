import db from "../db/index.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const token = req.cookies.refreshToken;

  //we are only fetching posts from users who we follo

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      //wrong refresh token
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      //correct token we send a new access token
      try {
        const q = await db.query(
          //get everything from post but from users get id, name, profilePic
          "SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON(u.id= p.userId) JOIN relationships AS r ON (p.userId = r.followedUserId AND r.followerUserId=$1 OR p.userId=$1) ORDER BY p.createdAt DESC",
          [decoded.id]
        );
        return res.status(200).json({
          posts: q.rows,
        });
      } catch (e) {
        res.status(500).json("Something went wrong while fetching posts");
      }
    }
  });
};
