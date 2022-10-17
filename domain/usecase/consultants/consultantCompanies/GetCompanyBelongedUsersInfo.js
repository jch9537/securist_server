// const { CompanyEntity } = require('../../entities');

// module.exports = class {
//     constructor({ companyRepository, userRepository }) {
//         this.companyRepository = companyRepository;
//         this.userRepository = userRepository;
//     }
//     async excute(userData, companyData) {
//         let result, response;
//         try {
//             let companyEntity = new CompanyEntity(companyData);
//             companyEntity.userType = userData.userType;
//             let userType = companyEntity.userType;

//             if (!(userType === 2 || userType === 3)) {
//                 throw new AuthorizationException('소속 컨설턴트 정보 가져오기');
//             }
//             let relationInfo = await this.userRepository.getRelationInfo(
//                 userData
//             );

//             let companyBelongingType = relationInfo['belonging_type'];
//             let companyManagerType = relationInfo['manager_type'];
//             // 기업 관리자 권한 확인
//             if (companyBelongingType !== 2 || companyManagerType !== 1) {
//                 throw new AuthorizationException('소속 컨설턴트 정보 가져오기');
//             }
//             response = await this.companyRepository.getCompanyBelongedUsersInfo(
//                 companyEntity
//             );
//             result = {
//                 message: '기업 소속 사용자 정보 리스트 가져오기 완료',
//                 data: response,
//             };
//             console.log('클라이언트 기업 결과----------------', result);
//             return result;
//         } catch (error) {
//             console.error(error);
//             error.message = '기업 소속 사용자 정보 리스트 가져오기 실패';
//             throw error;
//         }
//     }
// };
