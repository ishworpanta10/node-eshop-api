const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// middleware for parsing api
app.use(express.json());

require("dotenv/config");

const api = process.env.API_URL;

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

app.listen(3000, () => {
  console.log(`Server Started : http://localhost:3000${api}`);
});
