const debug = require('./debug');

const express = require('express');
const router = express.Router();

// define the home page route
router.use('/debug', debug)

module.exports = router;