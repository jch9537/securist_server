const {
    processingToken,
} = require('../../webService/authService/awsMiddleware');
const { TokenError } = require('../../../adapters/error');
// id token 복호화 : 사용자 cognito 가입정보 가져오기
module.exports = async (req, res, next) => {
    try {
        if (!req.token) {
            // query 와 path 파라미터 모두 없는 경우 : 둘 중 하나가 있는 경우는 next()로 넘김
            if (
                !Object.keys(req.query).length &&
                !Object.keys(req.params).length
            ) {
                throw new TokenError();
            }
        } else {
            let idToken = req.token;
            let userData = await processingToken.getUserByIdToken(idToken);
            // let userData = await authService.getUserByIdToken(idToken);
            // console.log('idToken데이터 확인', userData);
            let { email, userType, name } = userData;

            // 사용자 타입에 따라 이메일에 대한 키 값 변경
            if (userType === 1) {
                // 클라이언트인 경우
                req.userDataByIdToken = {
                    clientUserId: email,
                    userType: userType,
                    name: name,
                };
            } else {
                // 개인 컨설턴트인 경우 - userType === 2
                req.userDataByIdToken = {
                    consultantUserId: email,
                    userType: userType,
                    name: name,
                };
            }
            // console.log('아이디 토큰 복호화 토큰 : ', req.userDataByIdToken);
        }
        next();
    } catch (error) {
        //에러메세지
        console.log('ID 토큰 복호화 에러 : ', error);
        next(error);
    }
};
