var mongoose = require('mongoose');
var User = mongoose.model('User');
var Common = require('../helpers/common');

exports.greet = function(req, res, next) {
    let phone = req.params.phone;
    let geocode = req.params.geocode;   
    
    if (!phone) {
        return res.status(REQUEST.HTTP.ECODE.BAD_REQUEST).send({message: "Please provide a valid phone number"});
    }

    if (!geocode) {
        return res.status(REQUEST.HTTP.ECODE.BAD_REQUEST).send({message: "Please select a valid country"});
    }


    User.lookUpUser(phone, geocode, function(err, user){
        if (err) {
            console.error(err);
        } else if (user) {                                  
                let update = {                    
                    modified: Common.getUTCNow(),
                    active: false,
                    otp: Common.generateOTP()                
                }
                User.updateByPhone(phone, update, function(err) {
                    if (err) {
                        console.error(err);
                    } else {
                        return res.status(REQUEST.HTTP.ECODE.OK).send();
                    }
                });     
        } else {
            let user = {
                phone: phone, 
                countryCode: geocode,
                created: Common.getUTCNow(),
                modified: Common.getUTCNow(),
                active: false,
                otp: Common.generateOTP()                
            }      

            User.create(user, function(err, userData){
                if (err) {
                    console.error(err);
                    return res.status(500).send({
                        message: "Error Creating User Profile"
                    });
                } else {
                    res.status(REQUEST.HTTP.ECODE.CREATED).send();
                    // write code to send OTP to user
                    return next();
                }
            });      
        }           
    });    
}

exports.login = function(req, res, next) {
    let phone = req.params.phone;
    let otp = req.params.otp;   

    if (!phone) {
        return res.status(REQUEST.HTTP.ECODE.BAD_REQUEST).send({message: "Please provide a valid phone number"});
    }

    if (!otp) {
        return res.status(REQUEST.HTTP.ECODE.BAD_REQUEST).send({message: "Please enter a valid OTP"});
    }

    User.validateOTP(phone, otp, function(err, user){
        if (err) {
            console.error(err);           
        } else if(user) {
            let update = {
                status: true,
                active: true, 
				_id: user._id,
                apiToken: Common.secureRandomToken(),
                modified: Common.getUTCNow()
            }
            User.updateByPhone(phone, update, function(err, doc) {
                if (err) {
                    console.error(err);
                } else {
                    return res.status(REQUEST.HTTP.ECODE.OK).send(doc);
                }
            });                        
        } else {
            return res.status(REQUEST.HTTP.ECODE.OK).send({
                status: false
            });
        }
    });

}