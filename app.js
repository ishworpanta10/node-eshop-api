const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");

// middleware for parsing api
app.use(express.json());
// for logginh
app.use(morgan("tiny"));

require("dotenv/config");

const api = process.env.API_URL;

const connectionString = process.env.CONNECTION_STRING;

// initial route
app.get(`${api}/products`, (req, res) => {
  //   res.send("Hello API");

  const product = {
    id: 1,
    name: "product name test",
    image: "imageurl",
  };
  res.send(product);
});

app.post(`${api}/products`, (req, res) => {
  const newProduct = req.body;
  console.log(newProduct);

  res.send(newProduct);
});

// connecting to db before connecting to server
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "eshopDB",
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
