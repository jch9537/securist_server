// const {
//     GetConsultantUsers,
//     GetConsultantUser,
// } = require('../../../domain/usecase/consultant/consultantUsers');

// const { repository } = require('../../outbound');

// // 컨설턴트 기업 Adapter : 보류
// module.exports = class ConsultantCompaniesAdapter {
//     constructor(projectService, adminService) {
//         this.projectService = projectService;
//         this.adminService = adminService;
//     }
//     // 컨설턴트 리스트 가져오기
//     async getConsultantUsers() {
//         console.log(
//             '요청 > adapters > inbound > userAdaptor.js > getUsers - userId : '
//         );
//         let result;
//         try {
//             let getConsultantUsers = new GetConsultantUsers(repository);
//             result = await getConsultantUsers.excute();

//             return result;
//         } catch (error) {
//             console.log(
//                 '에러 응답 > adapters > inbound > userAdaptor.js > getUserInfo - error : ',
//                 error
//             );
//             throw error;
//         }
//     }

//     // 컨설턴트 정보 가져오기
//     async getConsultantUser(userData) {
//         console.log(
//             '요청 > adapters > inbound > userAdaptor.js > getUserInfo - userId : ',
//             userData
//         );
//         let result;
//         try {
//             let getConsultantUser = new GetConsultantUser(repository);
//             result = await getConsultantUser.excute(userData);
//             return result;
//         } catch (error) {
//             console.log(
//                 '에러 응답 > adapters > inbound > userAdaptor.js > getUserInfo - error : ',
//                 error
//             );
//             throw error;
//         }
//     }

//     // 컨설턴트 정보 수정하기
//     async updateClientUser(userData) {
//         console.log(
//             '요청 > adapters > inbound > userAdaptor.js > getUserInfo - userId : ',
//             userData
//         );
//         let result;
//         try {
//             let getClientUser = new GetClientUser(repository);
//             result = await getClientUser.excute(userData);
//             return result;
//         } catch (error) {
//             console.log(
//                 '에러 응답 > adapters > inbound > userAdaptor.js > getUserInfo - error : ',
//                 error
//             );
//             throw error;
//         }
//     }
// };
