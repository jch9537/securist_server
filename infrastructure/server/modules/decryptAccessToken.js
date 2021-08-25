const {
    processingToken,
} = require('../../webService/authService/awsMiddleware');
const { TokenError } = require('../../response');
// access token 복호화 : cognito 접근정보 가져오기
module.exports = async (req, res, next) => {
    try {
        if (!req.token) {
            // query 와 path 파라미터 모두 없는 경우 : 둘 중 하나가 있는 경우는 next()로 넘김
            if (
                !Object.keys(req.query).length &&
                !Object.keys(req.params).length
            ) {
                throw new TokenError('Access 토큰이 없습니다.');
            }
        }
        let accessToken = req.token;
        let accessData = await processingToken.checkAccessToken(accessToken);
        req.authDataByAccessToken = accessData;
        next();
    } catch (error) {
        next(error);
    }
};
