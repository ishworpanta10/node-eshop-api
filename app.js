const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const Product = require("../backend/models/products");

// middleware for parsing api
app.use(express.json());
// for logginh
app.use(morgan("tiny"));

require("dotenv/config");

const api = process.env.API_URL;

const connectionString = process.env.CONNECTION_STRING;

// initial route
app.get(`${api}/products`, async (req, res) => {
  const productList = await Product.find();
  // for error
  if (!productList) {
    res.status(500).json({
      message: "No Products",
      success: false,
    });
  }
  res.send(productList);
});

app.post(`${api}/products`, (req, res) => {
  // creating product from FrontEnd and pushing to db
  const product = new Product({
    // this key value must be same from which frontend data is send
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

// connecting to db before connecting to server
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

app.listen(3000, () => {
  console.log(`Server Started : http://localhost:3000${api}`);
});
