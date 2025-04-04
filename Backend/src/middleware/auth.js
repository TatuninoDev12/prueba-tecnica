const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  const token = req
    .header("Authorization")
    ?.toString()
    .replace("'", "")
    .replace("Bearer ", "");
  if (!token) return res.status(401).send("Access denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

exports.authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).send("Forbidden");
  }
  next();
};
