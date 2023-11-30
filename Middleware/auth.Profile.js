import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// update data check jwt token
const authMiddlewareUpdatedata = (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).json({ error: "Token is missing" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECERT);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({ error: "invalid token" });
  }
};

export default authMiddlewareUpdatedata;
