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
        required: true,
        index: true
    },
    photo: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
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
    }
}, {
    collection: 'User'
});

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