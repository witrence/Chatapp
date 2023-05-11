const jwt = require("jsonwebtoken");
/*
 function to generate a token along with a secret
 which will expire in 30 days
 then, using it in userControllers's token.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
