// install express-jwt
const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.SECRET_KEY;
  const api = process.env.API_URL;
  return (
    expressJwt({
      secret,
      algorithms: ["HS256"],
    })
      // exclude api for authorization
      .unless({
        path: [
          {
            // for filtering the api with methods and urls
            // url: `${api}/products`,
            // using regualr expression to exclude api as:
            url: /\/api\/v1\/products(.*)/,
            methods: ["GET", "OPTIONS"],
          },
          {
            url: /\/api\/v1\/categories(.*)/,
            methods: ["GET", "OPTIONS"],
          },
          `${api}/users/login`,
          `${api}/users/register`,
        ],
      })
  );
}

module.exports = authJwt;
