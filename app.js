const express = require("express");

const app = express();

const morgan = require("morgan");

const mongoose = require("mongoose");

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
