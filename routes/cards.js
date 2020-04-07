const fs = require('fs');
const express = require('express');
const router = express.Router();


router.get('/all', (req, res) => {
	let Cards = JSON.parse(fs.readFileSync('public/data/MTGACards.json'));
	return res.send(Cards);
});

module.exports = router;