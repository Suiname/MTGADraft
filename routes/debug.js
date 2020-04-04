const express = require('express');
const router = express.Router();

// define the home page route
router.get('/collection/:session', (req, res) => {
	let collection;
	if (req.params.session) {
		try {
			collection = req.Sessions[req.params.session].collection();
		} catch (error) {
			console.log('error: ', error);
			res.status(500).send('Internal Server Error');
		}
	} else {
		res.status(400).send('Bad Request');
	}
	if (collection) {
		res.send(collection);
	} else {
		res.status(404).send('Not Found');
	}
});

module.exports = router;