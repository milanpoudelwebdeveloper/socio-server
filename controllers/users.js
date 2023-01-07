import db from "../db/index.js";

export const getUsers = async (req, res) => {
  try {
    const q = await db.query("SELECT * FROM users LIMIT 5");
    return res.status(200).json({ users: q.rows });
  } catch (e) {
    res.status(500).json("Something went wrong while fetching users");
  }
};
