var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.validateUser = function(req, res, next) {
    var authKey = req.headers.authorization;
    if (!authKey) {
      res.status(REQUEST.HTTP.ECODE.UNAUTHORIZED).send({ message: "Authentication required"});
      return false;
    }
    User.findByAuthKey(authKey, function(err, user) {
      if (err) {
        res.status(REQUEST.HTTP.ECODE.UNAUTHORIZED).send({ message: "Authentication required"});
        return;
      }
  
      if (!user) {
        res.status(REQUEST.HTTP.ECODE.UNAUTHORIZED).send({ message: "Authentication required"});
  
      } else {
        req.user = user;
        return next();
      }
    });
}