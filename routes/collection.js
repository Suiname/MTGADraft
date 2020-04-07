const express = require('express');
const router = express.Router();

router.get('/:session', (req, res) => {
	let collection;
	if (req.params.session) {
		try {
			collection = req.Sessions[req.params.session].collection();
		} catch (error) {
			console.log('error: ', error);
			return res.status(500).send('Internal Server Error');
		}
	} else {
		return res.status(400).send('Bad Request');
	}
	if (collection) {
		return res.send(collection);
	} else {
		return res.status(404).send('Not Found');
	}
});

module.exports = router;