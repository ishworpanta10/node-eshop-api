const mongoose = require("mongoose");

const Product = require("../models/products");

exports.product_get_all = async (req, res) => {
  const productList = await Product.find();
  res.send({
    count: productList.length,
    productList: productList,
  });
  // for no products
  if (!productList) {
    res.status(500).json({
      message: "No Products",
      success: false,
    });
  }
};

exports.product_post = (req, res) => {
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
};
