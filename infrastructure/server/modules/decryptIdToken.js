const AuthService = require('../../webService/authService/awsCognito');
const { Exception } = require('../../../adapters/exceptions');
const { CognitoError } = require('../../error');
const authService = new AuthService();
// id token 복호화 : 사용자 cognito 가입정보 가져오기
module.exports = async (req, res, next) => {
    try {
        if (!req.token) {
            throw new Exception('ID 토큰이 없습니다.');
        }
        let idToken = req.token;
        let userData = await authService.getUserByIdToken(idToken);
        req.userDataByIdToken = userData;
        next();
    } catch (error) {
        //에러메세지
        console.log('토큰 복호화 에러3 : ', error);
        next(new CognitoError(error.message, 400, error.stack));
    }
};
