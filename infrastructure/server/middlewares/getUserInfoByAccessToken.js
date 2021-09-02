// // access token을 이용해 cognito 사용자 정보 가져오기 - 현재 사용안함
// const AuthService = require('../../webService/authService/awsCognito');
// const authService = new AuthService();
// const { TokenError } = require('../../response');

// module.exports = async (req, res, next) => {
//     try {
//         if (!req.token) {
//             // query 와 path 파라미터 모두 없는 경우 : 둘 중 하나가 있는 경우는 next()로 넘김
//             if (
//                 !Object.keys(req.query).length &&
//                 !Object.keys(req.params).length
//             ) {
//                 throw new TokenError('Access 토큰이 없습니다.');
//             }
//         }
//         let accessToken = req.token;
//         let accessUserData = await authService.getUserInfoByAccessToken(
//             accessToken
//         );
//         req.userDataByAccessToken = accessUserData;
//         next();
//     } catch (error) {
//         next(error);
//     }
// };
