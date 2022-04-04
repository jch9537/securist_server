// module.exports = class {
//     constructor(auth) {
//         this.auth = auth;
//     }
//     async excute(accessToken) {
//         let result, response;
//         try {
//             response = await this.auth.checkAccessToken(accessToken);

//             result = {
//                 message: 'access token 확인 완료',
//                 data: { isTokenValid: true },
//             };
//             return result;
//         } catch (error) {
//             throw error;
//         }
//     }
// };
