var configJs =
{
    "user": 
    {
        "http": 
        {
            "path":"/user",
            "getPort":8080,
            "putPort":8081,
            "posPort":8082,//send and update data
            "deletePort":8083
        },
        "socket": 
        {
            "path":"/user",
            "getPort":8000,
            "putPort":8001,
            "posPort":8002,//send and update data
            "deletePort":8003
        }
    },
    "admin":
    {
        "path":"/user",
        "getPort":1028,
        "putPort":1029,
        "posPort":1030,//send and update data
        "deletePort":1031
    }
};

module.exports = {config: configJs};