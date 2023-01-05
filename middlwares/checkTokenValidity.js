import jwt from "jsonwebtoken";
export const checkTokenValidity = async (req, res, next) => {
  const token = req.cookies.refreshToken;

  if (token) {
    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          //wrong refresh token
          return res.status(401).json({ message: "Unauthorized" });
        } else {
          req.id = decoded.id;
          next();
        }
      }
    );
  } else {
    return res.status(401).json({ message: "Not logged in" });
  }
};
