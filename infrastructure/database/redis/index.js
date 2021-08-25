const redis = require('redis');
const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379,
    db: 0,
    // password: '0000',
});
const { promisify } = require('util');

const getRedis = promisify(redisClient.get).bind(redisClient);
const setRedis = promisify(redisClient.set).bind(redisClient);

module.exports = {
    async getToken(tokenKey) {
        try {
            // 토큰 가져오기
            let token = await getRedis(tokenKey);
            return token;
        } catch (error) {
            throw error;
            // throw new ServiceAuthenticationError(error.message, error.name);
        }
    },
    async setToken({ tokenKey, token }) {
        try {
            // 토큰 저장
            await setRedis(tokenKey, token);
            return;
        } catch (error) {
            throw error;
            // throw new ServiceAuthenticationError(error.message, error.name);
        }
    },
};
