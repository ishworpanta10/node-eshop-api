// install express-jwt
const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.SECRET_KEY;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
  });
}

module.exports = authJwt;
