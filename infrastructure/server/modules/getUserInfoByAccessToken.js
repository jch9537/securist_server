const AuthService = require('../../webService/authService/awsCognito');
const authService = new AuthService();
// access token을 이용해 cognito 사용자 정보 가져오기
module.exports = async (req, res, next) => {
    try {
        let accessToken = req.token;
        let accessUserData = await authService.getUserInfoByAccessToken(
            accessToken
        );
        req.userDataByAccessToken = accessUserData;
    } catch (error) {
        throw error;
    }
    next();
};
