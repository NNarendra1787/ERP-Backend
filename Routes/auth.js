const express = require('express');
const userRoute = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../Models/User");

// post /api/register

userRoute.post("/register", [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({min: 6})
], async(req, res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()) return res.status(400).json({errors: error.array()});

    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({email});
        if(user) return res.status(400).json({message: "User alrady exists"});

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        user = new User({name, email, password: hashed, role});
        await user.save();

        const payload = {id: user._id, role: user.role};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
        res.json({token, user: {id: user._id, name: user.name, email: user.email, role: user.role}});


    } catch (error) {
        console.error(err);
        res.status(500).send('Server error');
    }
})


// POST /api/login
userRoute.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err); res.status(500).send('Server error');
  }
});

module.exports = userRoute;