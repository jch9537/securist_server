const userServerSecretKey = process.env.USER_SECRET_KEY;

const jwt = require('jsonwebtoken');
const { TokenError } = require('../../../adapters/error');

// 서비스 토큰 확인
module.exports = async (req, res, next) => {
    try {
        const serviceToken = req.token;
        console.log('서비스 토큰 도착 ', serviceToken);

        const verifyDataByServiceToken = jwt.verify(
            serviceToken,
            userServerSecretKey
        );
        console.log('토큰 확인 디코드 후 정보: ', verifyDataByServiceToken);

        next();
    } catch (error) {
        console.error(error, error.message);
        next(new TokenError(error.message));
        // next(error);
    }
};
