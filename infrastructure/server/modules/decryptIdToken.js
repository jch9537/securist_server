const AuthService = require('../../webService/authService/awsCognito');
const authService = new AuthService();
// id token 복호화 : 사용자 cognito 가입정보 가져오기
module.exports = async (req, res, next) => {
    let idToken = req.token;
    let userData = await authService.getUserByIdToken(idToken);
    req.userDataByIdToken = userData;
    next();
};
