// const axios = require('axios');
// const { getToken, setToken } = require('./index');
// const { TokenError, ServiceAuthenticationError } = require('../../response');
// const adminServiceUrl = 'http://localhost:5500';
// const projectServiceUrl = 'http://localhost:5000';

// module.exports = class {
//     constructor() {}
//     // async issueToken({ tokenKey, token }) {
//     //     try {
//     //         // 토큰 저장
//     //         setToken(tokenKey, token);
//     //         return;
//     //     } catch (error) {
//     //         throw new ServiceAuthenticationError(error.message, error.name);
//     //     }
//     // }
//     // async verifyToken({ serviceType, serviceToken }) {
//     //     console.log('여기는 안왔지????');
//     //     let result = {};
//     //     try {
//     //         console.log('토큰확인');
//     //         if (serviceType === 'admin') {
//     //             // 유저 서비스 요청
//     //             let tokenKey = process.env.USER_TOKEN_KEY_ADMIN;
//     //             let currentUserToken = await getToken(tokenKey);
//     //             if (serviceToken !== currentUserToken) {
//     //                 console.log('확인!!!');
//     //                 throw new TokenError('invalid token', 'InvalidTokenError');
//     //             }
//     //         } else {
//     //             // 프로젝트 서비스 요청 : serviceType === 'project'
//     //             let tokenKey = process.env.USER_TOKEN_KEY_PROJECT;
//     //             let currentUserToken = await getToken(tokenKey);
//     //             if (serviceToken !== currentUserToken) {
//     //                 console.log('확인!!!');
//     //                 throw new TokenError('invalid token', 'InvalidTokenError');
//     //             }
//     //         }
//     //         result.data = jwt.verify(serviceToken, process.env.USER_SECRET_KEY);
//     //         result.message = '토큰 확인 완료';
//     //         // console.log('타 서비스에서 받은 토큰으로 처리한 정보 : ', result);
//     //         return result;
//     //     } catch (error) {
//     //         console.log('외부요청 토큰 확인 ', error);
//     //         throw new TokenError(error.message, error.name);
//     //     }
//     // }
//     async issueTokenByAdminService({
//         serviceType,
//         serviceName,
//         servicePassword,
//     }) {
//         let result;
//         try {
//             console.log('안녕!!');
//             result = await axios({
//                 url: `${adminServiceUrl}/service/issuetoken`,
//                 method: 'post',
//                 data: {
//                     serviceName: serviceName,
//                     serviceType: serviceType,
//                     servicePassword: servicePassword,
//                 },
//             });
//             console.log(
//                 '어드민에서 생성한 토큰을 유저에서 받음 : ',
//                 result.data
//             );
//             return result.data;
//         } catch (error) {
//             let err = error.response.data;
//             throw ServiceAuthenticationError(err.errMessage, err.errName);
//         }
//     }
//     async verifyTokenByAdminService() {
//         let result;
//         try {
//             // 토큰 가져오기
//             let myToken = await getToken(process.env.ADMIN_TOKEN_KEY_USER);
//             console.log('유저 토큰 확인 ', myToken);
//             result = await axios({
//                 url: `${adminServiceUrl}/service/verify/user`,
//                 method: 'get',
//                 headers: { Authorization: myToken },
//             });
//             console.log('유저 > 어드민 토큰 보냄 결과: ', result.data);
//             return result.data;
//         } catch (error) {
//             let err = error.response.data;
//             throw new TokenError(err.errMessage, err.errName);
//         }
//     }
//     async issueTokenByProjectService({
//         serviceType,
//         serviceName,
//         servicePassword,
//     }) {
//         let result;
//         try {
//             result = await axios({
//                 url: `${projectServiceUrl}/service/issuetoken`,
//                 method: 'post',
//                 data: {
//                     serviceName: serviceName,
//                     serviceType: serviceType,
//                     servicePassword: servicePassword,
//                 },
//             });
//             console.log(
//                 '프로젝트에서 생성한 토큰을 유저에서 받음 : ',
//                 result.data
//             );
//             return result.data;
//         } catch (error) {
//             let err = error.response.data;
//             throw ServiceAuthenticationError(err.errMessage, err.errName);
//         }
//     }
//     async verifyTokenByProjectService() {
//         let result;
//         try {
//             // 토큰 가져오기
//             let myToken = await getToken(process.env.PROJECT_TOKEN_KEY_USER);
//             // myToken += 'a';
//             console.log('유저 토큰 확인 ', myToken);
//             result = await axios({
//                 url: `${projectServiceUrl}/service/verify/user`,
//                 method: 'get',
//                 headers: { Authorization: myToken },
//             });
//             console.log('유저 > 프로젝트 토큰 보냄 결과: ', result.data);
//             return result.data;
//         } catch (error) {
//             let err = error.response.data;
//             throw new TokenError(err.errMessage, err.errName);
//         }
//     }
// };
