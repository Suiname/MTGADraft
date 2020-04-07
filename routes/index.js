const collection = require('./collection');
const cards = require('./cards');

const express = require('express');
const router = express.Router();

// define the home page route
router.use('/collection', collection);
router.use('/cards', cards);

module.exports = router;