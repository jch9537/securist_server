// const { UserEntity } = require('../../entities');

// module.exports = class {
//     constructor({ userRepository }) {
//         this.userRepository = userRepository;
//     }
//     async excute(userData, updateData) {
//         let result, response;

//         let updateUserData = {
//             email: userData.email,
//             userType: userData.userType,
//             phoneNum: updateData.phoneNum,
//         };
//         try {
//             let result;
//             let userEntity = new UserEntity(updateUserData);
//             // 기업의 경우 소속/관리자 정보 확인
//             if (userEntity.userType === 2 || userEntity.userType === 3) {
//                 let relationInfo = await this.userRepository.getRelationInfo(
//                     userData
//                 );
//                 let companyBelongingType = relationInfo['belonging_type'];
//                 let companyManagerType = relationInfo['manager_type'];
//                 console.log(
//                     '릴레이션인포------------------------',
//                     companyBelongingType,
//                     companyManagerType
//                 );
//                 // 기업 & 관리자 권한 처리
//                 if (!(companyBelongingType === 2 && companyManagerType === 1)) {
//                     throw new AuthorizationException('기업 정보 수정');
//                 }
//             }
//             response = await this.userRepository.updatePhoneNum(userEntity);

//             result = {
//                 message: '연락처 변경 완료',
//                 data: {
//                     phoneNum: response,
//                 },
//             };
//             return result;
//         } catch (error) {
//             console.error(error);
//             error.message = '연락처 변경 실패';
//             throw error;
//         }
//     }
// };
