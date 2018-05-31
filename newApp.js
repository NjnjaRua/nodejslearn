//Init
var {config} = require('./config');
var express = require('express');
var getApp = express();
var putApp = express();
var postApp = express();
var deleteApp = express();

//Add User
//http://localhost:8081/user?userName=7777&score=7
putApp.put(config.user.http.path, (req, res) =>
{
    var userName = req.query.userName;
    var score = req.query.score;
    res.send('You have added ' + userName + " - " + score);
});

putApp.listen(config.user.http.putPort, () =>
{
    console.log('PutApp listening on port "' + config.user.http.putPort + '"!');
});

//Get User
//http://localhost:8080/user?userName=ABC&score=1
getApp.get(config.user.http.path, (req, res) =>
{
    var userName = req.query.userName;
    var score = req.query.score;
    res.send('Get info of ' + userName + ';' + score);
});
getApp.listen(config.user.http.getPort, () => console.log('GetApp listening on port "' + config.user.http.getPort + '"!'));

//Post User
//http://localhost:8082/user?userName=ABC&score=1
postApp.post(config.user.http.path, (req, res) =>
{
    var userName = req.query.userName;
    var score = req.query.score;
    res.send('You have updated of ' + userName + " - " + score);
});
postApp.listen(config.user.http.posPort, () =>
{
    console.log('postApp listening on port "' + config.user.http.posPort + '"!');
});

//Delete User
//http://localhost:8083/user?userName=ABC&score=1
deleteApp.delete(config.user.http.path, (req, res) =>
{
    var userName = req.query.userName;
    var score = req.query.score;
    res.send('You have deleted of ' + userName + " - " + score);
    //res.send("Delete is success");
});
deleteApp.listen(config.user.http.deletePort, () =>
{
    console.log('deleteApp listening on port "' + config.user.http.deletePort + '"!');
});
