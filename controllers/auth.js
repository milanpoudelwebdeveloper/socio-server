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

      //creating accesstoken
      const accessToken = jwt.sign(
        { id: user?.id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "10m",
        }
      );

      const refreshToken = jwt.sign(
        {
          id: user?.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );
      const { password, ...others } = user;

      //assigning refresh token in httpOnly Cookie
      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .status(200)
        .json({ message: "Logged in successfully", user: others, accessToken });
    } else {
      return res.status(404).json({ message: "Username doesn't exist" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong please try again" });
  }
};

export const refresh = async (req, res) => {
  if (req.cookies?.refreshToken) {
    //destructuring the jwt cookie
    const refreshToken = req?.cookies?.refreshToken;

    //verifying refresh token

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          //wrong refresh token
          return res.status(401).json({ message: "Unauthorized" });
        } else {
          //correct token we send a new access token
          const accessToken = jwt.sign(
            { id: decoded.id },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "10m",
            }
          );
          const q = await db.query("SELECT * FROM users WHERE id=$1", [
            decoded.id,
          ]);

          const user = q.rows[0];
          const { password, ...others } = user;
          return res.status(200).json({ accessToken, user: others });
        }
      }
    );
  } else {
    return res.status(406).json({ message: "Unauthorized" });
  }
};

export const logOut = async (req, res) => {
  res
    .clearCookie("refreshToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};
