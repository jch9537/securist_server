const AuthService = require('../../webService/authService/awsCognito');
const { Exception } = require('../../../adapters/exceptions');
const { CognitoError } = require('../../error');
const authService = new AuthService();
// id token 복호화 : 사용자 cognito 가입정보 가져오기
module.exports = async (req, res, next) => {
    try {
        if (!req.token) {
            // query 와 path 파라미터 모두 없는 경우 : 둘 중 하나가 있는 경우는 next()로 넘김
            if (!req.query && !req.params) {
                throw new Exception('ID 토큰이 없습니다.');
            }
        } else {
            let idToken = req.token;
            let userData = await authService.getUserByIdToken(idToken);
            req.userDataByIdToken = userData;
            console.log('아이디 토큰 복호화 토큰 : ', req.userDataByIdToken);
        }
        next();
    } catch (error) {
        //에러메세지
        console.log('토큰 복호화 에러3 : ', error);
        next(new CognitoError(error.message, 400, error.stack));
    }
};
