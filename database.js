

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });



client.set("string key", "string val", redis.print);
client.hset("hash key", "userName", "aaa", redis.print);
client.hset(["hash key", "score", "2"], redis.print);
client.hset("hash key", "userName", "bbb", redis.print);
client.hset(["hash key", "score", "3"], redis.print);
client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});