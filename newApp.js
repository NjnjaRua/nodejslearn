//Init
var {config} = require('./config');
var express = require('express');

//config Port
var conUserHttp = express();
conUserHttp.listen(config.user.http.port, () =>{
    console.log("UserHTTP listening port " + config.user.http.port);
});

var conUserWebSocket = require('ws');
var wss = new conUserWebSocket.Server({ port: 8001});
wss.on('connection', function connection(ws) {
    console.log('client connect');
});

var conAdmin = express();
conAdmin.listen(config.admin.port,()=>{
    console.log("Admin listening port " + config.admin.port);
});

/*Update Content*/
//Add User
conUserHttp.put('/user', (req, res) =>
{
    res.send('Create user Success');
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
