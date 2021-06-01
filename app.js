const express = require("express");

const app = express();

const morgan = require("morgan");

const mongoose = require("mongoose");

const authJwt = require("./helper/jwt");

const errorHandler = require("./helper/errror-handler");

const cors = require("cors");
// Routes
const productsRouter = require("./routers/products");
const categoriesRouter = require("./routers/categories");
const ordersRouter = require("./routers/orders");
const usersRouter = require("./routers/users");

// for .env file constants npm package
require("dotenv/config");

// MIDDLEWARES
// CORS
app.use(cors());
app.options("*", cors());

// for parsing request body
app.use(express.json());

// for logging data in console
app.use(morgan("tiny"));

// for auth jwt
app.use(authJwt());

// for errors
app.use(errorHandler);

// for static images folders
// __dirname gives the root path
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

// CONSTANTS
const api = process.env.API_URL;

// ROUTES
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/users`, usersRouter);

// DATABASE CONNECTION
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    // dbName: "eshopDB",
  })
  // success case
  .then(() => {
    console.log("Database Connection successful");
  })
  // error case
  .catch((err) => {
    console.log("Error Connection DB:", err);
  });

// SERVER
app.listen(3000, () => {
  console.log(`Server Started : http://localhost:3000`);
});
