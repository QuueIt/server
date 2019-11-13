var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.greet = function(req, res, next) {
    let phone = req.params.phone;
    let geocode = req.params.geocode;

    console.log(User, phone, geocode);
}