const { VouchersEntity } = require('../../../entities');

module.exports = class GetVouchersByClient {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(voucherData) {
        const { vouchersRepository } = this.repository;
        try {
            console.log(';dfm,.gvfdlkgjlkdfjg =============', voucherData);
            const vouchersEntity = new VouchersEntity(voucherData);
            const vouchersInfo = await vouchersRepository.getVouchersByClient(
                vouchersEntity
            );

            return vouchersInfo;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
