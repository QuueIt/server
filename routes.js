var express = require('express');
var router = express.Router();
var Welcome = require('./components/welcome');
var Profile = require('./components/profile');
var Auth = require('./middlewares/auth');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.send({
		message: "API Server is listening"
	});
});

router.get('/user/welcome/otp/:phone/:geocode', Welcome.greet);
router.get('/user/welcome/login/:phone/:otp', Welcome.login);

router.get('/user/profile', Auth.validateUser, Profile.get);
router.post('/user/profile/update', Auth.validateUser, Profile.update);
router.post('/user/profile/upload', Auth.validateUser, Profile.upload);

console.log("API Routes are Initialized!");

module.exports = router;
