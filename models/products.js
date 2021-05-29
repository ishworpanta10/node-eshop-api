const mongoose = require("mongoose");

// creating product db schema
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  richDescription: {
    type: String,
    default: "",
  },

  image: {
    type: String,
    default: "",
  },

  // gallery
  images: [
    {
      type: String,
    },
  ],

  brand: {
    type: String,
    default: "",
  },

  price: {
    type: Number,
    default: 0,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },

  rating: {
    type: Number,
    default: 0,
  },

  numReview: {
    type: Number,
    default: 0,
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },

  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

// if we export like this => module.Product = mongoose......
//  we need to import as :
// const {Product}= require('../models/products')
module.exports = mongoose.model("Product", productSchema);
