const redis = require('redis');

exports.init = function(callback) {        
    let client = redis.createClient(process.env.REDISCLOUD_URL);

    client.on("error", function (err) {
        console.log("Redis Error " + err);
        process.exit();
    });

    client.on('connect', function() {
        console.log('Redis Server is Connected!');    
        callback(client);
    });    
}