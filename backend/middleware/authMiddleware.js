const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // removing the bearer and taking the token [0][1](removing 0)
      token = req.headers.authorization.split(" ")[1];

      // decoding token ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next(); // moving on to the next operation back in userRoutes 2nd argument.
    } catch (err) {
      res.status(401);
      throw new Error("Not authorized, token failed !!");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized. Token not found !!");
  }
});

module.exports = { protect };
