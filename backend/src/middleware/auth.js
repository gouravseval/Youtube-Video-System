import jwt from "jsonwebtoken";

const jwtsecret = 'djdhfa84iqu3lhwkfh,,sajdlksjhf8&T87Y2384HRKWRKEFDHAHSFDJH'

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, jwtsecret);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};