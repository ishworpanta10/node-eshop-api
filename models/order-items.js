const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },
});

// creating frontend friendly id from _id
orderItemSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderItemSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("OrderItem", orderItemSchema);
