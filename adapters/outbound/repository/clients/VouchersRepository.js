// 클라이언트 사용자-기업 연결
module.exports = class VouchersRepository {
    constructor(db) {
        this.db = db;
    }
    async createVoucher(vouchersEntity) {
        try {
            await this.db.createVoucher(vouchersEntity);
            return;
        } catch (error) {
            throw error;
        }
    }
    async getVouchersByClient(vouchersEntity) {
        try {
            const result = await this.db.getVouchersByClient(vouchersEntity);
            return result;
        } catch (error) {
            throw error;
        }
    }
    async getVoucherTotalAmountByClientUser(vouchersEntity) {
        try {
            const result = await this.db.getVoucherTotalAmountByClientUser(
                vouchersEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
};
