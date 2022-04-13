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
    ClientCompaniesEntity,
    ClientUserAndCompanyEntity,
    ConsultantUsersEntity,
    ConsultingCompaniesEntity,
    ConsultantUserAndCompanyEntity,
} = require('../../entities');
const { CompanyEntity } = require('../../entities');
module.exports = class {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(signUpData) {
        let {
            clientUsersRepository,
            clientCompaniesRepository,
            clientUserAndCompanyRepository,
            consultantUsersRepository,
            consultingCompaniesRepository,
            consultantUserAndCompanyReporitory,
        } = this.repository;
        try {
            let belongingStatus, managerType;

            let {
                userType,
                email,
                password,
                name,
                businessLicenseNum,
                companyName,
                presidentName,
            } = signUpData;

            let authEntity = new AuthEntity({
                email,
                password,
                name,
                userType,
            });
            let profileStatus = 0; // 기본 프로필 인증 상태 0(인증불필요 : 클라이언트/컨설팅 기업)

            console.log(
                userType === 3
                    ? '클라이언트 사용자'
                    : userType === 2
                    ? '컨설팅 업체'
                    : '개인 컨설턴트'
            );

            // 클라이언트 =======================================================================
            if (userType === 3) {
                let clientUserId, clientCompanyId, clientUserAndCompanyEntity;
                // entity 정리
                let clientUserEntity = new ClientUsersEntity({
                    email,
                    userType,
                    name,
                    profileStatus,
                });
                let clientCompaniesEntity = new ClientCompaniesEntity({
                    businessLicenseNum,
                    companyName,
                    presidentName,
                });

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

                clientUserId = clientUserEntity.clientUserId;
                clientCompanyId = !clientCompanyInfo // 처음 등록된 기업 여부에 따라 처리 변경
                    ? undefined
                    : clientCompanyInfo.clientCompanyId;
                // 기업에 소속되어있는 관리자 확인
                belongingStatus = 2;
                managerType = 1;

                clientCompaniesEntity.clientCompanyId = clientCompanyId; // 기업 entity id추가

                // 기업-사용자 연결 엔터티 생성
                clientUserAndCompanyEntity = new ClientUserAndCompanyEntity({
                    clientUserId,
                    clientCompanyId,
                    belongingStatus,
                    managerType,
                });

                // 이미 등록된 기업인 경우 - 정책 확인 후 유지 또는 제거
                if (clientCompanyInfo !== undefined) {
                    // 등록된 사업자 & 관리자인 사용자 유무 확인
                    let isExistManager = await clientUserAndCompanyRepository.checkExistClientCompanyManager(
                        clientUserAndCompanyEntity
                    );
                    if (!!isExistManager) {
                        clientUserAndCompanyEntity.belongingStatus = 1; // 관리자가 있으므로 소속 요청 중으로 처리  : 정책 확인 !!!
                        clientUserAndCompanyEntity.managerType = null; // 관리자가 있으므로 관리자 아님 : 정책 확인 !!!
                    }
                }

                // 클라이언트 생성
                await clientUsersRepository.createClientUser(
                    authEntity,
                    clientUserEntity,
                    clientCompaniesEntity,
                    clientUserAndCompanyEntity
                );
            } else {
                // 컨설턴트 =================================================================
                let consultantUserId,
                    consultingCompanyId,
                    consultingCompaniesEntity,
                    consultantUserAndCompanyEntity;

                if (userType === 1) {
                    profileStatus = 1; // 개인 컨설턴트의 경우, 프로필 인증 상태 1(미인증) 처리;
                }
                // 개인/기업 공통 엔터티
                let consultantUserEntity = new ConsultantUsersEntity({
                    email,
                    userType,
                    name,
                    profileStatus,
                });

                if (userType === 2) {
                    // userType === 2 : 컨설팅 업체
                    consultingCompaniesEntity = new ConsultingCompaniesEntity({
                        businessLicenseNum,
                        companyName,
                        presidentName,
                    });
                    //------------------------------------------------

                    // 등록된 기업인지 여부 확인 : 기업 정보 가져오기
                    let consultantCompanyInfo = await consultingCompaniesRepository.getConsultingCompany(
                        consultingCompaniesEntity
                    );

                    console.log(
                        '기업 등록 여부 : ',
                        consultantCompanyInfo === undefined
                            ? '처음 등록 기업'
                            : '이미 등록된 기업'
                    );

                    consultantUserId = consultantUserEntity.consultantUserId;
                    consultingCompanyId = !consultantCompanyInfo // 처음 등록된 기업 여부에 따라 처리 변경
                        ? undefined
                        : consultantCompanyInfo.consultingCompanyId;
                    // 기업에 소속되어있는 관리자 확인
                    belongingStatus = 2;
                    managerType = 1;

                    consultingCompaniesEntity.consultingCompanyId = consultingCompanyId; // 기업 entity id추가

                    // 기업-사용자 연결 엔터티 생성
                    consultantUserAndCompanyEntity = new ConsultantUserAndCompanyEntity(
                        {
                            consultantUserId,
                            consultingCompanyId,
                            belongingStatus,
                            managerType,
                        }
                    );

                    // 이미 등록된 기업인 경우 - 정책 확인 후 유지 또는 제거
                    if (consultantCompanyInfo !== undefined) {
                        // 등록된 사업자 & 관리자인 사용자 유무 확인
                        let isExistManager = await consultantUserAndCompanyReporitory.checkExistConsultantCompanyManager(
                            consultantUserAndCompanyEntity
                        );
                        if (!!isExistManager) {
                            // 사용자 엔터티 변경
                            consultantUserEntity.userType = 1; // 관리자가 있으므로 개인 컨설턴트로 변경
                            consultantUserEntity.profileStatus = 1; // 컨설팅 업체 소속이므로 프로필 인증 불필요
                            // 사용자-기업 엔터티 변경
                            consultantUserAndCompanyEntity.belongingStatus = 1; // 관리자가 있으므로 소속 요청 중으로 처리  : 정책 확인 !!!
                            consultantUserAndCompanyEntity.managerType = null; // 관리자가 있으므로 관리자 아님 : 정책 확인 !!!
                        }
                    }
                }
                // 컨설턴트(개인/기업) 생성
                await consultantUsersRepository.createConsultantUser(
                    authEntity,
                    consultantUserEntity,
                    consultingCompaniesEntity, // 개인인 경우 undefined
                    consultantUserAndCompanyEntity
                );
            }

            // return;
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

// let signUpEntity = new AuthEntity(signUpData);
// let userType = signUpEntity.userType;
// //userType - 1: 개인 컨설턴트 2: 컨설팅업체 3: 클라이언트 기업
// if (userType === 2 || userType === 3) {
//     let companyData = {
//         businessLicenseNum: signUpData.businessLicenseNum,
//         companyName: signUpData.companyName,
//         presidentName: signUpData.presidentName,
//     };
//     // 기업(클라이언트, 컨설턴트) 정보 유효성 확인
//     let companyEntity = new CompanyEntity(companyData);

//     signUpEntity.businessLicenseNum =
//         companyEntity.businessLicenseNum;
//     signUpEntity.companyName = companyEntity.companyName;
//     signUpEntity.presidentName = companyEntity.presidentName;
// }
// response = await this.userRepository.signUp(signUpEntity);

// result = {
//     message: '회원 가입 완료',
// };
// return result;

//에러
// if (error.authServiceErrorName === 'UsernameExistsException') {
//     error.message = '이미 가입된 사용자 입니다.';
// } else if (
//     error.authServiceErrorName === 'InvalidPasswordException'
// ) {
//     error.message = '잘못된 암호입니다.'; // 아이디나 비번 틀릴 때 나오는 것 확인
//     // } else if (
//     //     error.authServiceErrorName === 'InvalidParameterException'
//     // ) {
//     //     error.message = '유효하지 않은 인자입니다.';
// } else {
//     error.message = '회원가입 실패';
// }
