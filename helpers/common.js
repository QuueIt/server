var moment = require('moment');
var crypto = require('crypto');

exports.generateOTP = function() {
    return Math.floor(1000 + Math.random() * 9000);
}

exports.getUTCNow = function() {
    return moment.utc();
}

exports.secureRandomToken = function() {
    return crypto.randomBytes(64).toString('hex');
};