const redis = require('redis');

const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    },
    password: process.env.REDIS_PASSWORD
});

redisClient.connect()
redisClient.on('error', (error) => { console.log("error", error.message) })
redisClient.on('connect', () => { console.log("Redis Connected...") })
redisClient.on('ready', () => { console.log("Redis Ready...") })

module.exports = redisClient;