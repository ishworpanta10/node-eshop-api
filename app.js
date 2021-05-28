const express = require("express");

const app = express();

const morgan = require("morgan");

const mongoose = require("mongoose");

const productRouter = require("./routers/products");

// for .env file constants npm package
require("dotenv/config");

// MIDDLEWARES
// for parsing request body
app.use(express.json());
// for logging data in console
app.use(morgan("tiny"));

// CONSTANTS
const api = process.env.API_URL;
const connectionString = process.env.CONNECTION_STRING;

// ROUTES
app.use(`${api}/products`, productRouter);

// DATABASE CONNECTION
mongoose
  .connect(connectionString, {
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
