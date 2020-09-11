require("dotenv").config();
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  //check for token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    //verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    //add user from payload
    req.user = decodedToken;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is not valid, authorization denied" });
  }
}

module.exports = auth;
