var express = require('express');
var router = express.Router();
var Welcome = require('./components/welcome');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.send({
		message: "API Server is listening"
	});
});

router.get('/user/welcome/otp/:phone/:geocode', Welcome.greet);

module.exports = router;
