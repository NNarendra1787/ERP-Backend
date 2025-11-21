const express = require("express");
const NUserRouters = express.Router();

const User = require("../Models/User");
const auth = require("../Middleware/auth");
const permit = require("../Middleware/roles");
const bcrypt = require("bcryptjs");

// GET ALL USERS (Admin only)
NUserRouters.get("/", auth, permit("admin"), async (req, res) => {
  const users = await User.find({}, "-password");
  res.json(users);
});

// CREATE USER (Admin only)
NUserRouters.post("/", auth, permit("admin"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      role
    });

    await user.save();
    res.json(user);

  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating user");
  }
});

// UPDATE USER ROLE (Admin only)
NUserRouters.put("/:id", auth, permit("admin"), async (req, res) => {
  const { role } = req.body;
  const updated = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  res.json(updated);
});

// DELETE USER (Admin only)
NUserRouters.delete("/:id", auth, permit("admin"), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

module.exports = NUserRouters;
