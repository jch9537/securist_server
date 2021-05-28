module.exports = class {
    constructor(db) {
        this.db = db;
    }
    // 기업--------------------------------------------------------------------
    // GET
    async getCompanyInfo(companyEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > getCompanyInfo > userData : ',
            companyEntity
        );
        let result;
        try {
            result = await this.db.getCompanyInfo(companyEntity);
            console.log(
                '응답 > Adapter > outBound > repository > getCompanyInfo > result : ',
                result
            );
        } catch (error) {
            throw error;
        }
        return result;
    }
    async getCompanyList(userData) {
        console.log(
            '요청 > Adapter > outBound > repository > getCompanyList > 요청없음 : '
        );
        let result;
        try {
            result = await this.db.getCompanyList(userData);
            console.log(
                '응답 > Adapter > outBound > repository > getCompanyList > result : ',
                result
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    async getCompanyBelongedUsersInfo(companyEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > getCompanyBelongedUsersInfo > companyEntity : ',
            companyEntity
        );
        let result;
        try {
            result = await this.db.getCompanyBelongedUsersInfo(companyEntity);
            console.log(
                '응답 > Adapter > outBound > repository > getCompanyBelongedUsersInfo > result : ',
                result
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
};
