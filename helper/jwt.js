// install express-jwt
const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.SECRET_KEY;
  const api = process.env.API_URL;
  return (
    expressJwt({
      secret,
      algorithms: ["HS256"],
      isRevoked: isRevoked,
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
          // for gallery images
          {
            url: /\/public\/uploads(.*)/,
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

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    return done(null, true);
  }
  done();
}

module.exports = authJwt;
