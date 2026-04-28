const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyzeController');
const auth = require('../middleware/auth');

router.post('/', auth, analyzeController.analyzeResume);

module.exports = router;
