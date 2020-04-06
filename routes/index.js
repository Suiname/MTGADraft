const collection = require('./collection');

const express = require('express');
const router = express.Router();

// define the home page route
router.use('/collection', collection);

module.exports = router;