import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // this must contain id of the user
    next();
  } catch (err) {
    console.error("JWT verify error:", err);
    res.status(403).json({ message: "Invalid or expired token." });
  }
};
