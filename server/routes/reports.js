const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const auth = require('../middleware/auth');

router.post('/', auth, reportsController.createReport);
router.get('/', auth, reportsController.getReports);

module.exports = router;
