const { ClientGradeInfoEntity } = require('./../../entities');

module.exports = class GetClients {
    constructor(repository) {
        this.repository = repository;
    }
    async excute() {
        const {
            clientUsersRepository,
            linkedClientUsersCompaniesRepository,
            clientCompaniesRepository,
            clientGradeInfoRepository,
        } = this.repository;
        try {
            // 클라이언트 사용자 정보 리스트 가져오기
            const clientUsersInfo = await clientUsersRepository.getClientUsers();
            const clientUserIds = clientUsersInfo.map(
                (userInfo) => userInfo.clientUserId
            );

            // 사용자들의 사용자-기업 연결정보 가져오기
            const belongingUsersData = {
                clientUserIds: clientUserIds,
                belongingStatus: 1, // 소속된 사용자들 정보만 가져오기
            }; // 데이터 가공
            const clientslinkedInfo = await linkedClientUsersCompaniesRepository.getLinkedInfoByBelongingClientUsers(
                belongingUsersData
            );

            // 클라이언트 회사정보 리스트 가져오기 : 소속된 사용자꺼만
            const companyIds = clientslinkedInfo.map(
                (linkedInfo) => linkedInfo.clientCompanyId
            ); //데이터 가공
            const clientCompaniesInfo = await clientCompaniesRepository.getClientCompanies(
                companyIds
            );

            // 클라이언트 사용자 등급 정보를 통해 최종 사용자 등급 산출 후 적용
            const clientGradeInfoList = await clientGradeInfoRepository.getClientGradeInfoListByUserIds(
                clientUserIds
            );

            // 응답 데이터 가공
            const clientsInfo = clientslinkedInfo.map((linkedInfo) => {
                const clientInfo = {
                    clientUserId: linkedInfo.clientUserId,
                    clientCompanyId: linkedInfo.clientCompanyId,
                };
                clientGradeInfoList.forEach((gradeInfo) => {
                    if (gradeInfo.clientUserId === linkedInfo.clientUserId) {
                        let clientGradeInfoEntity = new ClientGradeInfoEntity(
                            gradeInfo
                        );
                        clientInfo.clientUserGrade = clientGradeInfoEntity.calculateClientUserGrade();
                    }
                });
                clientCompaniesInfo.forEach((companyInfo) => {
                    if (
                        companyInfo.clientCompanyId ===
                        linkedInfo.clientCompanyId
                    ) {
                        clientInfo.companyName = companyInfo.companyName;
                        clientInfo.approvalStatus = companyInfo.approvalStatus;
                    }
                });
                return clientInfo;
            });

            return clientsInfo;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
