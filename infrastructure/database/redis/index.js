// TODO : 레디스 오류들 확인 후 Error class 처리 - 현재 토큰만 사용해서 토큰오류로 처리
// redis
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
    async getToken(key) {
        try {
            // 토큰 가져오기
            let token = await getRedis(key);
            return token;
        } catch (error) {
            throw error;
        }
    },
    async setToken({ key, value }) {
        try {
            // 토큰 저장
            await setRedis(key, value);
            return;
        } catch (error) {
            throw error;
        }
    },
};
