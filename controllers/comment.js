import db from "../db/index.js";

export const postComment = async (req, res) => {
  const { descp } = req.body;
  try {
    const q = await db.query(
      "INSERT INTO comments($descp, $createdAt, userId, postId)",
      []
    );
  } catch (e) {
    console.log(e);
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
