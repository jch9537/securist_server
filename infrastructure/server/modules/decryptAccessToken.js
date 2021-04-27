const AuthService = require('../../webService/authService/awsCognito');
const authService = new AuthService();
// access token 복호화 : cognito 접근정보 가져오기
module.exports = async (req, res, next) => {
    let accessToken = req.token;
    let accessData = await authService.getAuthInfoByAccessToken(accessToken);
    req.authDataByAccessToken = accessData;
    next();
};
