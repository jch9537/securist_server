/* TODO : 정책확인 
1. 클라이언트의 경우 기업의 관리자/소속사용자의 구분이 있는지
2. 구분이 있다면 소속사용자는 관리자의 허가가 있어야 기업 소속 처리가 가능한지

3. 개인컨설턴트로 가입한 컨설팅 업체 소속 사용자는 프로필인증이 필요한지
4. 컨설팅 업체 소속 사용자의 사용자 타입은 뭐로 정의되는지 (컨설팅업체와 연결된 개인컨설턴트 or 컨설팅업체)
5. 
*/
const {
    AuthEntity,
    ClientUsersEntity,
    // ClientGradeInfoEntity,
    ClientCompaniesEntity,
    LinkedClientUsersCompaniesEntity,
    ConsultantUsersEntity,
    // ConsultantGradeInfoEntity,
    // ConsultantPenaltyEntity,
    // LinkedConsultantUsersCompaniesEntity,
    // ConsultingCompaniesEntity,
} = require('../../entities');
module.exports = class SignUp {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(signUpData) {
        let {
            clientUsersRepository,
            clientCompaniesRepository,
            linkedClientUsersCompaniesRepository,
            consultantUsersRepository,
            // consultingCompaniesRepository,
            // consultantUserAndCompanyRepository,
        } = this.repository;
        try {
            let { email, password, name, userType } = signUpData;

            let authData = {
                email: email,
                password: password,
                name: name,
                userType: userType,
            };

            let authEntity = new AuthEntity(authData);
            // let profileStatus = 0;

            console.log(
                userType === 1
                    ? '클라이언트 사용자'
                    : userType === 2
                    ? '개인 컨설턴트'
                    : '컨설팅 업체'
            );
            // 클라이언트 =======================================================================
            if (userType === 1) {
                // entity 정리
                let userData = {
                    clientUserId: email,
                    name: name,
                    userType: userType,
                    profileStatus: 0,
                    // 기본 프로필 인증 상태 0(인증불필요 : 클라이언트/컨설팅 기업), 개인 컨설턴트 - 미인증 처리
                };
                let clientUserEntity = new ClientUsersEntity(userData);

                let clientCompanyData = {
                    businessLicenseNum: signUpData.businessLicenseNum,
                };
                let clientCompaniesEntity = new ClientCompaniesEntity(
                    clientCompanyData
                );

                // 등록된 기업인지 여부 확인 : 기업 정보 가져오기
                let clientCompanyInfo = await clientCompaniesRepository.getClientCompany(
                    clientCompaniesEntity
                );

                console.log(
                    '기업 등록 여부 : ',
                    clientCompanyInfo === undefined
                        ? '처음 등록 기업'
                        : '이미 등록된 기업'
                );

                let clientUserAndCompanyData = {
                    clientUserId: clientUserEntity.clientUserId,
                    clientCompayId: !clientCompanyInfo
                        ? undefined
                        : clientCompanyInfo.clientCompanyId, // 처음 등록된 기업 여부에 따라 처리 변경
                    belongingStatus: 1, // 소속 처리
                    managerType: 1, // 관리자 처리
                };

                // 기업-사용자 연결 엔터티 생성
                let linkedClientUsersCompaniesEntity = new LinkedClientUsersCompaniesEntity(
                    clientUserAndCompanyData
                );

                // 이미 등록된 기업인 경우 - 정책 확인 후 유지 또는 제거
                if (clientCompanyInfo !== undefined) {
                    // 등록된 사업자 & 관리자인 사용자 유무 확인
                    let isExistManager = await linkedClientUsersCompaniesRepository.checkExistClientCompanyManager(
                        linkedClientUsersCompaniesEntity
                    );
                    if (!!isExistManager) {
                        linkedClientUsersCompaniesEntity.belongingStatus = 0; // 관리자가 있으므로 소속 요청 중으로 처리  : 정책 확인 !!!
                        linkedClientUsersCompaniesEntity.managerType = null; // 관리자가 있으므로 관리자 아님 : 정책 확인 !!!
                    }
                }

                // 클라이언트 생성
                await clientUsersRepository.createClientUser(
                    authEntity,
                    clientUserEntity,
                    clientCompaniesEntity,
                    linkedClientUsersCompaniesEntity
                );
            } else {
                // 컨설턴트 =================================================================
                let consultingCompaniesEntity, consultantUserAndCompanyEntity;

                // 개인/기업 공통 엔터티
                let userData = {
                    consultantUserId: email,
                    name: name,
                    userType: userType,
                    profileStatus: userType === 2 ? 1 : 0,
                    // 기본 프로필 인증 상태 0(인증불필요 : 클라이언트/컨설팅 기업), 개인 컨설턴트 - 미인증 처리
                };
                let consultantUsersEntity = new ConsultantUsersEntity(userData);

                // 컨설팅 업체 우선 배제
                // if (userType === 3) {
                //     // userType === 3 : 컨설팅 업체
                //     let consultingCompanyData = {
                //         businessLicenseNum: signUpData.businessLicenseNum,
                //         companyName: signUpData.companyName,
                //         presidentName: signUpData.presidentName,
                //     };
                //     consultingCompaniesEntity = new ConsultingCompaniesEntity(
                //         consultingCompanyData
                //     );
                //     //------------------------------------------------

                //     // 등록된 기업인지 여부 확인 : 기업 정보 가져오기
                //     let consultantCompanyInfo = await consultingCompaniesRepository.getConsultingCompany(
                //         consultingCompaniesEntity
                //     );

                //     console.log(
                //         '기업 등록 여부 : ',
                //         consultantCompanyInfo === undefined
                //             ? '처음 등록 기업'
                //             : '이미 등록된 기업'
                //     );

                //     // 컨설턴트-기업 연결 엔터티 생성
                //     let consultantUserAndCompanyData = {
                //         consultantUserId:
                //             consultantUsersEntity.consultantUserId,
                //         consultingCompanyId: !consultantCompanyInfo // 처음 등록된 기업 여부에 따라 처리 변경
                //             ? undefined
                //             : consultantCompanyInfo.consultingCompanyId,
                //         belongingStatus: 1,
                //         managerType: 1,
                //     };

                //     consultantUserAndCompanyEntity = new ConsultantUserAndCompanyEntity(
                //         consultantUserAndCompanyData
                //     );

                //     // 이미 등록된 기업인 경우 - 정책 확인 후 유지 또는 제거
                //     if (consultantCompanyInfo !== undefined) {
                //         // 등록된 사업자 & 관리자인 사용자 유무 확인
                //         let isExistManager = await consultantUserAndCompanyRepository.checkExistConsultantCompanyManager(
                //             consultantUserAndCompanyEntity
                //         );
                //         if (!!isExistManager) {
                //             // 사용자 엔터티 변경
                //             consultantUsersEntity.userType = 1; // 관리자가 있으므로 개인 컨설턴트로 변경
                //             consultantUsersEntity.profileStatus = 1; // 컨설팅 업체 소속이므로 프로필 인증 불필요
                //             // 사용자-기업 엔터티 변경
                //             consultantUserAndCompanyEntity.belongingStatus = 0; // 관리자가 있으므로 소속 요청 중으로 처리  : 정책 확인 !!!
                //             consultantUserAndCompanyEntity.managerType = null; // 관리자가 있으므로 관리자 아님 : 정책 확인 !!!
                //         }
                //     }
                // }
                // 컨설턴트(개인/기업) 생성
                await consultantUsersRepository.createConsultantUser(
                    authEntity,
                    consultantUsersEntity,
                    consultingCompaniesEntity, // 개인인 경우 undefined
                    consultantUserAndCompanyEntity
                );
            }

            return;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
//!! 개인 컨설턴트가
// 1. 사용자 정보 생성
// 2. 등록 기업 사용자 유무 확인
// 2-1. 등록된 기업 없음
// 3. 기업 정보 생성
// 4. 생성한 기업 정보 가져오기
// 5. 기업-사용자 연결
// *. 코그니토 사용자 생성

// 2-2. 등록된 기업 있음
// 3. 등록된 기업 정보 가져오기
// 4. 사용자-기업에서 기업관리자 존재여부 확인
// 4-1. 관리자가 없다면 자동 소속 처리 & 관리자로 등록
// 4-2. 관리자가 있다면 가입자 사용자 타입을 컨설턴트(userType === 1)로 변경 & 소속요청 중으로 처리 & 관리자가 아닌 상태로 변경
// 5. 기업-사용자 연결
// *. 코그니토 사용자 생성
