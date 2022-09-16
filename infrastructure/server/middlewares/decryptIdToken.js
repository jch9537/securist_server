// id token 복호화 : 사용자 cognito 가입정보 가져오기
const { processingToken } = require('../../webService/authService');

module.exports = async (req, res, next) => {
    try {
        const idToken = req.token;
        const tokenDecryptData = await processingToken.getUserByIdToken(
            idToken
        );
        // 복호화 데이터 유효성 확인
        const { email, userType, name } = tokenDecryptData;

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

        next();
    } catch (error) {
        //에러메세지
        console.log('ID 토큰 복호화 에러 : ', error);
        next(error);
    }
};
