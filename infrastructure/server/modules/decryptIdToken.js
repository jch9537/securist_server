const {
    processingToken,
} = require('../../webService/authService/awsMiddleware');
const { TokenError } = require('../../response');
// id token 복호화 : 사용자 cognito 가입정보 가져오기
module.exports = async (req, res, next) => {
    try {
        if (!req.token) {
            // query 와 path 파라미터 모두 없는 경우 : 둘 중 하나가 있는 경우는 next()로 넘김
            if (
                !Object.keys(req.query).length &&
                !Object.keys(req.params).length
            ) {
                throw new TokenError('ID 토큰이 없습니다.');
            }
        } else {
            let idToken = req.token;
            let userData = await processingToken.getUserByIdToken(idToken);
            // let userData = await authService.getUserByIdToken(idToken);
            req.userDataByIdToken = userData;
            console.log('아이디 토큰 복호화 토큰 : ', req.userDataByIdToken);
        }
        next();
    } catch (error) {
        //에러메세지
        console.log('ID 토큰 복호화 에러 : ', error);
        next(error);
    }
};
