//Init
var {config} = require('./config');
var express = require('express');

var bodyParser = require('body-parser');

//Start Redis
var redis = require("redis");
var client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

var userCount = 0;
client.get("userCount", function(err, obj)
{
    if(obj != null)
        userCount = parseInt(obj);
});
//end Redis

//start body parser
// create application/json parser
var jsonParser = bodyParser.json();

//end body parser

//config Port
var conUserHttp = express();
conUserHttp.listen(config.user.http.port, () =>{
    console.log("UserHTTP listening port " + config.user.http.port);
});

var conUserWebSocket = require('ws');
var wss = new conUserWebSocket.Server({ port: config.user.webSocket.port});
wss.on('connection', function connection(ws) {
    console.log('client connect');
});

var conAdmin = express();
conAdmin.listen(config.admin.port,()=>{
    console.log("Admin listening port " + config.admin.port);
});

/*Update Content*/
//Add User

// parse various different custom JSON types as JSON
conUserHttp.use(jsonParser);
conUserHttp.put('/user', (req, res) =>
{
    
    var username = req.body.username;
    var score = req.body.score;
    
    console.log("userCount= " + userCount);

    client.get("userCount", function(err, obj)
    {
        client.hset("userId:" + userCount,"userName", username, redis.print);
        client.hset("userId:" + userCount,"score", score, redis.print);

        //client.hset("userId:" + userCount, {"userName": username, "score": score}, redis.print);
    });
    // client.hkeys("userId:" + userCount, function (err, replies) {
    //     console.log(replies.length + " replies:");
    //     replies.forEach(function (reply, i) {
    //         console.log("    " + i + ": " + reply);
    //     });
    // });
    userCount++;
    client.set("userCount", userCount, redis.print);
    res.send('Create user Success ' + username + " ; " + score);
    
});
//Get User
conUserHttp.get('/user/:userId', (req, res) =>
{
    res.send('Get user info Success');
});

//Post User
conUserHttp.post('/user/:userId', (req, res) =>
{
    var id = req.params.userId;
    sendWsMsg(id);
    res.send('Update user success');
});

//Delete Use
conAdmin.delete('/user/:userId', (req, res) =>
{
    res.send('Delege user success');
});

function sendWsMsg(content)
{
    for(var client of wss.clients)
    {
        client.send(content);
    }
}
