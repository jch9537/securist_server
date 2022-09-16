const { VouchersEntity } = require('../../../entities');

module.exports = class CreateVoucher {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(voucherData) {
        const { vouchersRepository } = this.repository;
        try {
            const vouchersEntity = new VouchersEntity(voucherData);
            await vouchersRepository.createVoucher(vouchersEntity);

            return;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
