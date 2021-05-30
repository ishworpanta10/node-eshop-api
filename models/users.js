const mongoose = require("mongoose");

const userSchema = mongoose.Schema({});

// creating frontend friendly id from _id
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("User", userSchema);
