const {
    ConsultantUsersEntity,
    ConsultantGradeInfoEntity,
    ConsultantPenaltyEntity,
} = require('../../entities');
module.exports = class GetConsultant {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(consultantData) {
        let {
            consultantUsersRepository,
            consultantGradeInfoRepository,
            consultantPenaltyRepository,
        } = this.repository;
        try {
            // 컨설턴트 사용자 정보 가져오기
            const consultantUsersEntity = new ConsultantUsersEntity(
                consultantData
            );
            const consultantUserInfo = await consultantUsersRepository.getConsultantUser(
                consultantUsersEntity
            );
            // 사용자(컨설턴트) 등급 정보 가져오기
            const consultantGradeInfoEntity = new ConsultantGradeInfoEntity(
                consultantData
            );
            const consultantGradeInfo = await consultantGradeInfoRepository.getConsultantGradeInfo(
                consultantGradeInfoEntity
            );
            // 사용자 페널티 횟수 가져오기
            const consultantPenaltyEntity = new ConsultantPenaltyEntity(
                consultantData
            );
            const penaltyCount = await consultantPenaltyRepository.getCountConsultantPenalty(
                consultantPenaltyEntity
            );

            // 응답 데이터 정리
            consultantUserInfo.gradeInfo = consultantGradeInfo;
            consultantUserInfo.penaltyCount = penaltyCount;

            return consultantUserInfo;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
