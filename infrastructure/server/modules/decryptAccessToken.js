const AuthService = require('../../webService/authService/awsCognito');
const { Exception } = require('../../../adapters/exceptions');
const { CognitoError } = require('../../error');
const authService = new AuthService();
// access token 복호화 : cognito 접근정보 가져오기
module.exports = async (req, res, next) => {
    try {
        if (!req.token) {
            throw new Exception('Access 토큰이 없습니다.');
        }
        let accessToken = req.token;
        let accessData = await authService.getAuthInfoByAccessToken(
            accessToken
        );
        req.authDataByAccessToken = accessData;
        next();
    } catch (error) {
        next(new CognitoError(error.message, 400, error.stack));
    }
};
