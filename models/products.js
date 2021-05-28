const mongoose = require("mongoose");

// creating product db schema
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
  },
});

// if we export like this => module.Product = mongoose......
//  we need to import as :
// const {Product}= require('../models/products')
module.exports = mongoose.model("Product", productSchema);
