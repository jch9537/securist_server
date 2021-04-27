// module.exports = class {
//     constructor(Auth) {
//         this.Auth = Auth;
//     }
//     async excute(token) {
//         let result;
//         try {
//             result = await this.Auth.getUserInfoByAccessToken(token);
//             console.log('결과----------------', result);
//         } catch (error) {
//             console.log('에러 ----------------', error);
//             throw error;
//         }
//         return result;
//     }
// };
