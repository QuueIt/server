var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	res.send({
		message: "API Server is listening"
	});
});

module.exports = router;
