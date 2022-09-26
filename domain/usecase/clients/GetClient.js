const {
    ClientUsersEntity,
    ClientCompaniesEntity,
    LinkedClientUsersCompaniesEntity,
    VouchersEntity,
} = require('./../../entities');

module.exports = class GetClient {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(clientData) {
        const {
            clientUsersRepository,
            linkedClientUsersCompaniesRepository,
            clientCompaniesRepository,
            vouchersRepository,
        } = this.repository;
        try {
            // 클라이언트 사용자 정보 가져오기
            const clientUsersEntity = new ClientUsersEntity(clientData);
            const clientUserInfo = await clientUsersRepository.getClientUser(
                clientUsersEntity
            );

            // 바우처 금액 가져오기
            const vouchersEntity = new VouchersEntity(clientData);
            const voucherInfo = await vouchersRepository.getVoucherTotalAmountByClientUser(
                vouchersEntity
            );
            console.log(
                ('바우처 합계 타입 ', typeof voucherInfo.totalVoucherAmount)
            );

            // 사용자들의 사용자-기업 연결정보 가져오기
            const linkedClientUsersCompaniesEntity = new LinkedClientUsersCompaniesEntity(
                clientData
            );
            const clientlinkedInfo = await linkedClientUsersCompaniesRepository.getLinkedInfoByClientUser(
                linkedClientUsersCompaniesEntity
            );

            // 클라이언트 회사정보 가져오기
            const clientCompaniesEntity = new ClientCompaniesEntity(
                clientlinkedInfo
            );
            const clientCompanyInfo = await clientCompaniesRepository.getClientCompany(
                clientCompaniesEntity
            );

            // 응답 데이터 정리
            clientUserInfo.clientCompanyId = clientCompanyInfo.clientCompanyId;
            clientUserInfo.companyName = clientCompanyInfo.companyName;
            clientUserInfo.businessLicenseNum =
                clientCompanyInfo.businessLicenseNum;
            clientUserInfo.totalVoucherAmount = voucherInfo.totalVoucherAmount;

            return clientUserInfo;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
