const redis = require('redis');
const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379,
    db: 0,
    // password: '0000',
});
const { promisify } = require('util');

module.exports = {
    getToken: promisify(redisClient.get).bind(redisClient),
    setToken: promisify(redisClient.set).bind(redisClient),
};
