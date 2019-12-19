const mongoose = require('mongoose');
const User = mongoose.model('User');
const Common = require('../helpers/common');
const fs = require('fs');
const AWS = require('aws-sdk');
const s3Stream = require('s3-upload-stream');

// to prevent slow internet fail 
AWS.config.httpOptions = { timeout: 5000 };

const S3 = s3Stream(new AWS.S3());

const BUCKET_NAME = 'quueit-profile';

exports.update = function(req, res) {
    let userProfile = req.user;
    let user = req.body;

    user.modified = Common.getUTCNow();

    User.updateByUserId(userProfile._id, user, function(err, user){
        if (err) {
            console.error(err);
        } else {
            return res.status(REQUEST.HTTP.ECODE.OK).send(user);
        }
    });
}

exports.upload = function(req, res) {
    let userProfile = req.user;

    console.log("Request to Upload file to AWS");
    req.pipe(req.busboy); // Pipe it trough busboy

    req.busboy.on('file', (fieldname, file, filename) => {
        console.log(`Upload of '${filename}' started`);

        var upload = S3.upload({
            Bucket: BUCKET_NAME,
            Key: filename,
            ACL: "public-read"
        });

        // Optional configuration
        upload.maxPartSize(20971520); // 20 MB
        upload.concurrentParts(5);

        // Handle errors.
        upload.once('error', function (error) {
            console.log("Error uploading", error);
        });
        
        // { Location: 'https://bucketName.s3.amazonaws.com/filename.ext',
        //      Bucket: 'bucketName',
        //      Key: 'filename.ext',
        //      ETag: '"bf2acbedf84207d696c8da7dbb205b9f-5"' }

        upload.once('uploaded', function (details) {
            console.log("Successfully Uploaded", details);
            let user = {
                photo: details.Location,
                modified: Common.getUTCNow()
            };
            User.updateByUserId(userProfile._id, user, function(err, user){
                if (err) {
                    console.error(err);
                } else {
                    return res.status(REQUEST.HTTP.ECODE.OK).send(user);
                }
            });            
        });

        file.pipe(upload);
    });
}