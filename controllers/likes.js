import db from "../db/index.js";

export const getLikes = async (req, res) => {
  try {
    const q = await db.query("SELECT * FROM likes WHERE postId = $1", [
      req.query.postId,
    ]);
    return res.status(200).json({
      likes: q.rows,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const postLike = async (req, res) => {
  try {
    const q = await db.query(
      "INSERT INTO likes (userId, postId) VALUES ($1, $2) RETURNING *",
      [req.id, req.query.postId]
    );
    return res.status(200).json({ liked: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong while liking post" });
  }
};

export const deleteLike = async (req, res) => {
  try {
    const q = await db.query(
      "DELETE FROM likes WHERE userId = $1 AND postId = $2",
      [req.id, req.query.postId]
    );
    return res.status(200).json({ liked: false });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong while unliking post" });
  }
};
