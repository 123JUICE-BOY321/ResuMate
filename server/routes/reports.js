const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Report = require('../models/Report');

// Middleware to auth user
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Create a Report
router.post('/', auth, async (req, res) => {
    try {
        const newReport = new Report({
            user: req.user.id,
            ...req.body
        });

        const report = await newReport.save();
        res.json(report);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get User Reports
router.get('/', auth, async (req, res) => {
    try {
        const reports = await Report.find({ user: req.user.id }).sort({ date: -1 });
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
