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

// creating  model
module.exports = mongoose.model("Product", productSchema);
