const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Report = require('../models/Report');

// Register
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({
      name,
      email,
      password,
      username,
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${name}`
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5 days' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, username: user.username, email: user.email, avatar: user.avatar } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5 days' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, username: user.username, email: user.email, avatar: user.avatar } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update User
router.put('/update', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { name, password } = req.body;
        
        const updateFields = { name, avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${name}` };
        
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(decoded.user.id, { $set: updateFields }, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete User
router.delete('/delete', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        await Report.deleteMany({ user: decoded.user.id });
        await User.findByIdAndDelete(decoded.user.id);
        
        res.json({ msg: 'User deleted' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
