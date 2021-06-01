const mongoose = require("mongoose");

const User = require("../models/users");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

exports.user_get_all = async (req, res, next) => {
  const userList = await User.find().select("-passwordHash");
  if (!userList) {
    res.status(500).json({
      message: "No User Registered",
      success: false,
    });
  }
  res.status(200).send({
    count: userList.length,
    userList: userList,
  });
};

exports.user_get_detail = async (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
    .select("-passwordHash")
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          success: false,
          message: "user not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err,
      });
    });
};

exports.user_post = async (req, res, next) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();

  if (!user)
    return res.status(404).json({
      message: "user cannot be created",
    });

  res.send(user);
};

exports.user_update = async (req, res, next) => {
  const id = req.params.id;

  const user = await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
    },
    {
      new: true,
    }
  );
  if (!user) {
    res.status(404).json({ message: "User cannot be updated" });
  }

  res.status(200).send(user);
};

exports.user_delete = (req, res, next) => {
  const id = req.params.id;

  User.findByIdAndRemove(id)
    .then((user) => {
      if (user) {
        return res.status(200).json({
          success: true,
          message: "User deleted successfully",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Unable to delete user",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        error: err,
      });
    });
};

exports.user_login = async (req, res, next) => {
  const user = User.findOne({ email: req.body.email });
  // checking if user exists in db
  if (!user) {
    return res.status(404).send({
      message: "User not found",
    });
  }
  // if user exits compare password
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const secret = process.env.SECRET_KEY;
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).send({
      message: "User Authenticated",
      email: user.email,
      token: token,
    });
  } else {
    res.status(200).send({
      message: "password is wrong !",
    });
  }
};

exports.user_register = async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (user) {
    return res.status(200).send({
      message: "User already exists with email address",
    });
  }

  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();

  if (!user)
    return res.status(404).json({
      message: "user cannot be created",
    });

  res.send(user);
};

exports.user_count = async (req, res) => {
  const userLength = await User.countDocuments((count) => count);

  if (!userLength) {
    return res.status(500).json({
      success: false,
      message: "error getting user count",
    });
  }

  res.status(200).json({
    userLength: userLength,
  });
};
