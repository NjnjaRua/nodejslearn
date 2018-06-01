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
const userKey = 'userId:';
// parse various different custom JSON types as JSON
conUserHttp.use(jsonParser);
conUserHttp.put('/user', (req, res) =>
{    
    var username = req.body.username;
    var score = req.body.score;
    var numUpdate = req.body.numUpdate;    
    client.get("userCount", function(err, obj)
    {
        client.hset(userKey + userCount,"userName", username, redis.print);
        client.hset(userKey + userCount,"score", score, redis.print);
        client.hset(userKey + userCount,"numUpdate", numUpdate, redis.print);
        userCount++;
        client.set("userCount", userCount, redis.print);
        res.send('Success ' + JSON.stringify(obj));
    });
});
//Get User
conUserHttp.get('/user/:userId', (req, res) =>
{
    var userId = req.params.userId;
    client.hgetall(userKey + userId, function(err, obj)
    {
        res.send('Success'  + JSON.stringify(obj));
    });
});

//Post User
conUserHttp.post('/user/:userId', (req, res) =>
{
    var userId = req.params.userId;
    client.hgetall(userKey+userId, function(err, obj)
    {
        if(obj != null && err == null)
        {
            var userNameNew = req.body.username;
            var scoreNew = req.body.score;

            var numUpdate = obj.numUpdate;
            numUpdate++;
            obj.numUpdate = numUpdate;
            var newObj = JSON.stringify(obj);

            client.hset(userKey + userId,"userName", userNameNew, redis.print);
            client.hset(userKey + userId,"score", scoreNew, redis.print);
            client.hset(userKey + userId,"numUpdate", numUpdate, redis.print);
            
            var args = [ 'leaderboard', scoreNew, userId];
            client.zadd(args, function (err, response) 
            {
                console.log(err);    
            });
            sendWsMsg(newObj);
            res.send(newObj);        
        }
        else
        {
            res.send(404);        
        }
    });
});

//Delete Use
conAdmin.delete('/user/:userId', (req, res) =>
{
    var userId = req.params.userId;
    var hashKey = userKey + userId;
    client.hgetall(hashKey, function(err, obj)
    {
        if(obj != null && err == null)
        {
            client.del(hashKey);
            res.send(200);
        }
        else
        {
            res.send(404);
        }
    });
});

function sendWsMsg(content)
{
    for(var client of wss.clients)
    {
        client.send(content);
    }
}
