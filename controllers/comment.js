import db from "../db/index.js";
import moment from "moment";
export const postComment = async (req, res) => {
  const { descp } = req.body;
  try {
    const q = await db.query(
      "INSERT INTO comments(descp, createdAt, userId, postId) VALUES($1, $2, $3, $4) returning *",
      [
        descp,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        req.id,
        req.query.postId,
      ]
    );

    console.log("hey the q here is", q.rows[0]);
    if (q.rows[0] === undefined)
      return res
        .status(500)
        .json({ message: "Something went wrong while adding comment" });

    const q2 = await db.query(
      "SELECT c.*, name, u.id as userId, profilePic FROM comments AS c JOIN users AS u ON (c.userId = u.id) WHERE c.id=$1",
      [q.rows[0].id]
    );
    console.log("hey the q2 here is", q2.rows[0]);
    return res.status(200).json({
      newComment: q2.rows[0],
    });
  } catch (e) {
    console.log("Something went wrong while adding a comment, check please", e);
    res.status(500).json("Something went wrong while adding comment");
  }
};

export const getComments = async (req, res) => {
  console.log("hey post query", req.query.postId);
  try {
    const q = await db.query(
      "SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c join USERS as u ON (u.id = c.userId) WHERE c.postId=$1 ORDER BY c.createdAt DESC",
      [req.query.postId]
    );
    return res.status(200).json({ comments: q.rows });
  } catch (e) {
    console.log(e);
    res.status(500).json("Something went wrong while fetching comments");
  }
};
