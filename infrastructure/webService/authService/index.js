//TODO 없애고 adapter와 awsCognito를 바로 연결

// const Cognito = require('./awsCognito');
// // 클라우드 등록 서비스(aws_cognito, azure_activedirectory 등.. )의 공통적인 내용이 담긴 클래스
// module.exports = class {
//     constructor() {
//         this.cloudAuth = new Cognito();
//     }
//     async signUp(userData) {
//         console.log(
//             '요청 > Infrastructure > webService > authService > index.js - signUp : ',
//             userData
//         );
//         let result = await this.cloudAuth.signUp(userData);
//         console.log(
//             '응답 > Infrastructure > webService > authService > index.js - signUp > result : ',
//             result
//         );
//         return result;
//     }
//     async createUser(userData) {
//         console.log(
//             '요청 > Infrastructure > webService > authService > index.js - createUser : ',
//             userData
//         );
//         let result = await this.cloudAuth.createUser(userData);
//         console.log(
//             '응답 > Infrastructure > webService > authService > index.js - createUser > result : ',
//             result
//         );
//         return result;
//     }
//     authUser() {
//         console.log(
//             '요청 > Infrastructure > webService > authService > index.js - authUser : '
//         );
//     }
//     async confirmUser(email) {
//         console.log(
//             '요청 > Infrastructure > webService > authService > index.js - confirmUser > email : ',
//             email
//         );
//         let result = await this.cloudAuth.getEmail(email);
//         console.log(
//             '응답 > Infrastructure > webService > authService > index.js - confirmUser > result : ',
//             result
//         );
//         return result;
//     }
//     async deleteUserByAdmin(id) {
//         console.log(
//             '요청 > Infrastructure > webService > authService > index.js - deleteUserByAdmin > id : ',
//             id
//         );
//         let result = await this.cloudAuth.deleteUserByAdmin(id);
//         console.log(
//             '응답 > Infrastructure > webService > authService > index.js - deleteUserByAdmin > result : ',
//             result
//         );
//         return result;
//     }
// };
