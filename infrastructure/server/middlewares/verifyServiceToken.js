const jwt = require('jsonwebtoken');

// 서비스 토큰 확인
module.exports = async (req, res, next) => {
    let result;

    let serviceToken = req.token;
    console.log('서비스 토큰 도착 ', serviceToken);

    try {
        let mySecretKey = process.env.USER_SECRET_KEY;
        let verifyDataByServiceToken = jwt.verify(serviceToken, mySecretKey);
        console.log('토큰 확인 디코드 후 정보: ', verifyDataByServiceToken);

        result = {
            message: '토큰 확인 완료',
            data: verifyDataByServiceToken,
        };

        req.verifyToken = result;
        next();
    } catch (error) {
        console.error(error);
        next(error);
    }
};
