import db from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, name, email, password } = req.body;
  //CHECK IF USER EXISTS
  try {
    //checking for username
    const q = await db.query("SELECT * FROM users WHERE username=$1", [
      username,
    ]);
    if (q.rows.length > 0) {
      return res
        .status(401)
        .json({ message: "User already exists. Please try another username" });
    }

    //checking for email

    const q2 = await db.query("SELECT * FROM users WHERE email=$1", [email]);

    if (q2.rows.length > 0) {
      return res
        .status(401)
        .json({ message: "Email already exists. Please try another email" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = await db.query(
      "INSERT INTO users (username, name, password, email) VALUES($1, $2, $3, $4) returning *",
      [username, name, hashedPassword, email]
    );
    res.status(200).json({
      message: "User created successfully",
      user: newUser.rows[0],
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong please try again" });
  }
};

export const login = async (req, res) => {
  const { username } = req.body;
  try {
    const q = await db.query("SELECT * FROM users WHERE username=$1", [
      username,
    ]);

    if (q.rows.length > 0) {
      const user = q.rows[0];
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }
      const token = jwt.sign({ id: user }, process.env.JWT_SECRET);
      const { password, ...others } = user;
      res
        .cookie("accessToken", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ message: "Logged in successfully", user: others });
    } else {
      return res.status(404).json({ message: "Username doesn't exist" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong please try again" });
  }
};

export const logOut = async (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};
