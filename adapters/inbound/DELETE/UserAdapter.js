// /*
// TODO : 기존 코드에서 사용자와 기업의 처리(router에서 - infra까지)를 분기하기
// // 사용자와 기업은 다른 영역으로 보고 처리하기 : 코드가 복잡하고 꼬이게 됨
// */
// // 메서드 정의 인터페이스 - 컨트롤러
// const {
//     GetClientUsers,
//     GetClientUser,
// } = require('../../domain/usecase/clientUsers');
// const {
//     CreateUserAndCompanyRelation,
//     GetUserInfo,
//     GetRelationInfo,
//     GetUserBelongingCompanyInfo,
//     UpdatePhoneNum,
//     UpdateBankInfo,
//     UpdateUserBelongingStatus,
//     DeleteUser,
// } = require('../../domain/usecase/user');

// const { repository } = require('../outbound');
// const authAdapter = require('./AuthAdapter');

// module.exports = class UserAdapter {
//     constructor(projectService, adminService) {
//         this.projectService = projectService;
//         this.adminService = adminService;
//     }
//     // 사용자 리스트 가져오기
//     async getUsers(pageData) {
//         console.log(
//             '요청 > adapters > inbound > userAdaptor.js > getUsers - userId : ',
//             pageData
//         );
//         let result;
//         try {
//             let { pageType } = pageData;
//             // 사용자 타입에 따라 usecase 분류
//             if (pageType === 'client') {
//                 let getClientUsers = new GetClientUsers(repository);
//                 result = await getClientUsers.excute();
//             } else {
//                 // userType === 'consultant : 컨설턴트
//             }
//             return result;
//         } catch (error) {
//             console.log(
//                 '에러 응답 > adapters > inbound > userAdaptor.js > getUserInfo - error : ',
//                 error
//             );
//             throw error;
//         }
//     }

//     // 사용자 정보 가져오기
//     async getUser(userData) {
//         console.log(
//             '요청 > adapters > inbound > userAdaptor.js > getUserInfo - userId : ',
//             userData
//         );
//         let result;
//         try {
//             let { userType } = userData;
//             if (userType === 1) {
//                 // 클라이언트 정보 가져오기
//                 let getClientUser = new GetClientUser(repository);
//                 result = await getClientUser.excute(userData);
//             } else {
//                 // 컨설턴트 정보 가져오기
//             }
//             // let getUserInfo = new GetUserInfo(repository);
//             // let result = await getUserInfo.excute(userData);
//             // console.log(
//             //     '응답 > adapters > inbound > userAdaptor.js > getUserInfo - result : ',
//             //     result
//             // );
//             return result;
//         } catch (error) {
//             console.log(
//                 '에러 응답 > adapters > inbound > userAdaptor.js > getUserInfo - error : ',
//                 error
//             );
//             throw error;
//         }
//     }
//     // 사용자 정보 변경 - 공통 : 연락처
//     async updatePhoneNum(userData, updateData) {
//         console.log(
//             '요청 > adapters > inbound > userAdaptor.js > updatePhoneNum - userId : ',
//             userData,
//             updateData
//         );
//         try {
//             let updatePhoneNum = new UpdatePhoneNum(repository);
//             let result = await updatePhoneNum.excute(userData, updateData);
//             console.log(
//                 '응답 > adapters > inbound > userAdaptor.js > updatePhoneNum - result : ',
//                 result
//             );
//             return result;
//         } catch (error) {
//             console.log(
//                 '에러 응답 > adapters > inbound > userAdaptor.js > updatePhoneNum - error : ',
//                 error
//             );
//             throw error;
//         }
//     }
//     // 사용자 정보 변경 - 컨설턴트 공통 : 입금정보
//     async updateBankInfo(userData, updateData) {
//         console.log(
//             '요청 > adapters > inbound > userAdaptor.js > updateBankInfo - userId : ',
//             userData,
//             updateData
//         );
//         try {
//             let updateBankInfo = new UpdateBankInfo(repository);
//             let result = await updateBankInfo.excute(userData, updateData);
//             console.log(
//                 '응답 > adapters > inbound > userAdaptor.js > updateBankInfo - result : ',
//                 result
//             );
//             return result;
//         } catch (error) {
//             console.log(
//                 '에러 응답 > adapters > inbound > userAdaptor.js > updateBankInfo - error : ',
//                 error
//             );
//             throw error;
//         }
//     }
//     // 회원탈퇴
//     async deleteUser(accessToken, deleteData) {
//         // 기업삭제를 할꺼면 email과 userType을 가져와야하고 / 사용자만 삭제할 꺼면 현재대로 처리해도 됨
//         console.log(
//             '요청 > adapters > inbound > userAdaptor > deleteUser - token : ',
//             accessToken,
//             'deleteData : ',
//             deleteData
//         );
//         try {
//             let verifyUserData = await authAdapter.verifyUserByPassword(
//                 accessToken,
//                 deleteData
//             );
//             console.log(
//                 '응답 > adapters > inbound > userAdaptor.js > getUserInfoByAccessToken - userData : ',
//                 verifyUserData
//             );
//             let newToken = verifyUserData.AccessToken;

//             let userData = await authAdapter.getUserInfoByAccessToken(
//                 accessToken
//             );
//             console.log(
//                 '응답 > adapters > inbound > userAdaptor.js > getUserInfoByAccessToken - userData : ',
//                 userData
//             );
//             let withdrawalData = {
//                 email: userData.email,
//                 userType: userData.userType,
//                 withdrawalType: deleteData.withdrawalType,
//             };
//             let deleteUser = new DeleteUser(repository);
//             let result = await deleteUser.excute(newToken, withdrawalData);
//             console.log(
//                 '응답 > adapters > inbound > userAdaptor > deleteUser - result : ',
//                 result
//             );
//             return result;
//         } catch (error) {
//             console.log(
//                 '에러 응답 > adapters > inbound > userAdaptor > deleteUser - result : ',
//                 error
//             );
//             throw error;
//         }
//     }
//     // 사용자-기업 연결 정보 생성
//     async createUserAndCompanyRelation(userData, companyData) {
//         console.log(
//             '요청 > adapters > inbound > relationAdapter > createUserAndCompanyRelation - companyData : ',
//             userData,
//             companyData
//         );
//         try {
//             let createUserAndCompanyRelation = new CreateUserAndCompanyRelation(
//                 repository
//             );
//             let result = await createUserAndCompanyRelation.excute(
//                 userData,
//                 companyData
//             );
//             console.log(
//                 '응답 > adapters > inbound > relationAdapter > createUserAndCompanyRelation - result : ',
//                 result
//             );
//             return result;
//         } catch (error) {
//             console.log(
//                 '에러 응답 > adapters > inbound > relationAdapter > createUserAndCompanyRelation - error : ',
//                 error
//             );
//             throw error;
//         }
//     }

//     // 사용자-기업 연결정보 가져오기
//     async getRelationInfo(userData) {
//         console.log(
//             '요청 > adapters > inbound > userAdaptor > getRelationInfo - userData : ',
//             userData
//         );
//         try {
//             let getRelationInfo = new GetRelationInfo(repository);
//             let result = await getRelationInfo.excute(userData);
//             console.log(
//                 '응답 > adapters > inbound > userAdaptor > getRelationInfo - result : ',
//                 result
//             );
//             return result;
//         } catch (error) {
//             console.log(
//                 '에러 응답 > adapters > inbound > userAdaptor > getRelationInfo - error : ',
//                 error
//             );
//             throw error;
//         }
//     }
//     // 사용자 소속기업 정보 가져오기
//     async getUserBelongingCompanyInfo(userData) {
//         console.log(
//             '요청 > adapters > inbound > userAdaptor > getUserBelongingInfo - userData : ',
//             userData
//         );
//         try {
//             let getUserBelongingCompanyInfo = new GetUserBelongingCompanyInfo(
//                 repository
//             );
//             let result = await getUserBelongingCompanyInfo.excute(userData);
//             console.log(
//                 '응답 > adapters > inbound > userAdaptor > getUserBelongingInfo - result : ',
//                 result
//             );
//             return result;
//         } catch (error) {
//             console.log(
//                 '에러 응답 > adapters > inbound > userAdaptor > getUserBelongingInfo - error : ',
//                 error
//             );
//             throw error;
//         }
//     }
//     // // 사용자 비밀번호 수정
//     // async changePassword(token, updatePasswordData) {
//     //     console.log(
//     //         '요청 > adapters > inbound > userAdaptor > changePassword - userParam : ',
//     //         token,
//     //         updatePasswordData
//     //     );
//     //     try {
//     //         let result = await authAdapter.changePassword(
//     //             token,
//     //             updatePasswordData
//     //         );
//     //         console.log(
//     //             '응답 > adapters > inbound > userAdaptor > changePassword - result : ',
//     //             result
//     //         );
//     //         return result;
//     //     } catch (error) {
//     //         console.log(
//     //             '에러 응답 > adapters > inbound > userAdaptor > changePassword - result : ',
//     //             error
//     //         );
//     //         throw error;
//     //     }
//     // }

//     // 기업-사용자 소속상태 변경 처리 : 기업, 사용자 공통
//     async updateUserBelongingStatus(userData, updateData) {
//         let result, updateStatusData, companyIdColumn;
//         console.log(
//             '요청 > adapters > inbound > userAdaptor > updateBelongingStatus - userId : ',
//             userData,
//             updateData
//         );
//         try {
//             // -------------주석 코드 usecase로 이동--------------------------
//             //    // userData.userType = 1; //테스트용
//             //    if (userData.userType === 1) {
//             //     updateStatusData = {
//             //         userType: userData.userType,
//             //         companyId: updateData.companyId,
//             //         email: userData.email,
//             //         // email: 'mg.sun@aegisecu.com', //테스트용
//             //         belongingType: updateData.belongingType,
//             //     };
//             // } else {
//             //     // if (userData.userType === 3) {
//             //     //     companyIdColumn = 'client_company_id';
//             //     // } else if (userData.userType === 2) {
//             //     //     companyIdColumn = 'consulting_company_id';
//             //     // }
//             //     // let companyInfo = await userAdapter.getUserBelongingCompanyInfo(
//             //     //     userData
//             //     // );
//             //     // let companyId = companyInfo[companyIdColumn];
//             //     // updateStatusData = {
//             //     //     userType: userData.userType,
//             //     //     companyId: companyId,
//             //     //     email: updateData.userId,
//             //     //     belongingType: updateData.belongingType,
//             //     // };
//             //     throw new UserTypeException('사용자');
//             // }

//             let updateBelongingStatus = new UpdateUserBelongingStatus(
//                 repository
//             );
//             result = await updateBelongingStatus.excute(
//                 userData,
//                 updateStatusData
//             );
//             console.log(
//                 '응답 > adapters > inbound > userAdaptor > updateBelongingStatus- result : ',
//                 result
//             );
//             return result;
//         } catch (error) {
//             console.log(
//                 '에러 > adapters > inbound > userAdaptor > updateBelongingStatus- error : ',
//                 error
//             );
//             throw error;
//         }
//     }

//     // DELETE
//     async deleteUserAndCompanyRelation(deleteData) {
//         console.log(
//             '요청 > Adapter > outBound > repository > deleteUserAndCompanyRelation > deleteData: ',
//             deleteData
//         );
//         let result;
//         try {
//             result = await this.db.deleteUserAndCompanyRelation(deleteData);
//             console.log(
//                 '응답 > Adapter > outBound > repository > deleteUserAndCompanyRelation > result : ',
//                 result
//             );
//             return result;
//         } catch (error) {
//             throw error;
//         }
//     }
// };
