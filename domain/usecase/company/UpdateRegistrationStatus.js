const { RelationEntity } = require('../../entities');
const {
    AuthorizationException,
    UserTypeException,
} = require('../../exceptions');

module.exports = class {
    constructor({ userRepository, companyRepository }) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }
    async excute(userData, updateStatusData) {
        let result, response;
        try {
            let userType = userData.userType;
            if (!(userType === 2 || userType === 3)) {
                throw new UserTypeException('사용자 타입');
            }

            let relationEntity = new RelationEntity(updateStatusData);
            relationEntity.userType = userType;

            let relationInfo = await this.userRepository.getRelationInfo(
                userData
            );

            let companyBelongingType = relationInfo['belonging_type'];
            let companyManagerType = relationInfo['manager_type'];
            console.log(
                '릴레이션인포------------------------',
                companyBelongingType,
                companyManagerType
            );
            // 기업 관리자 권한 확인
            if (!(companyBelongingType === 2 && companyManagerType === 1)) {
                throw new AuthorizationException('소속 정보 수정');
            }

            // 응답 결과
            response = await this.companyRepository.updateRegistrationStatus(
                relationEntity
            );
            // 처리 타입별 응답 메세지 분기
            if (response.length === 0) {
                // throw new NoContent('사용자의 소속 정보');
                result = {
                    message: '사용자의 소속 정보가 없습니다.',
                };
            }
            let belongingType = response['belonging_type'];

            if (belongingType === 0) {
                result = {
                    message: '소속 해제 완료',
                };
            } else {
                // belongingType === 2
                result = {
                    message: '소속 요청 승인 완료',
                };
            }
            // else { // DB에서 오는 belongingType은 문제없는 것으로 보고 처리
            //     throw new TypeException('소속');
            // }

            return result;
        } catch (error) {
            console.error(error);
            error.message = '소속 상태 변경 실패';
            throw error;
        }
    }
};
