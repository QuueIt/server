var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    phone: {
        type: String,
        required: true,
        index: true
    },
    name: {
        type: String,        
        index: true
    },
    photo: {
        type: String        
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    country: {
        type: String
    },
    countryCode: {
        type: String,
        required: true
    },
    apiToken: {
        type: String
    },
    deviceToken: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now()
    },
    modified: {
        type: Date
    },
    otp: {
        type: String
    }
}, {
    collection: 'User'
});

userSchema.statics.create = function (obj, callback) {
    new this(obj).save(callback);
};

userSchema.statics.lookUpUser = function (phone, code, callback) {
    this.findOne({
        'phone': phone,
        'countryCode': code
    }, callback);
};

userSchema.statics.validateOTP = function (phone, code, callback) {
    this.findOne({
        'phone': phone,
        'otp': code
    }, callback);
};

userSchema.statics.updateByPhone = function(phone, obj, callback) {
    this.update({phone: phone}, obj, callback);
}

userSchema.methods.toJSON = function () {
    return {
        _id: this.id,
        name: this.name,
        photo: this.photo,
        active: this.active,
        phone: this.phone,
        email: this.email,
        address: this.address,
        modified: this.modified,
        countryCode: this.countryCode,
        apiToken: this.apiToken
    }
};

module.exports = User = mongoose.model("User", userSchema);