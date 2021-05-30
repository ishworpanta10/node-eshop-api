const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({});

// creating frontend friendly id from _id
orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Order", orderSchema);
