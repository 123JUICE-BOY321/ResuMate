const Report = require('../models/Report');

exports.createReport = async (req, res) => {
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
};

exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find({ user: req.user.id }).sort({ date: -1 });
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
