module.exports = class {
    constructor(db) {
        this.db = db;
    }
    // 프로필 --------------------------------------------------------------------
    // CREATE
    // 사용자
    async createConsultantProfileTemp(createProfileTempEntity, uploadData) {
        console.log(
            '요청 > Adapter > outBound > repository > createConsultantProfileTemp > createProfileTempEntity: ',
            createProfileTempEntity,
            uploadData
        );
        let result;
        try {
            result = await this.db.createConsultantProfileTemp(
                createProfileTempEntity,
                uploadData
            );
            console.log(
                '응답 > Adapter > outBound > repository > createConsultantProfileTemp > result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '응답 > Adapter > outBound > repository > createConsultantProfileTemp > result : ',
                error
            );
            throw error;
        }
    }
    //기업
    async createConsultingCompanyProfileTemp(
        createProfileTempEntity,
        uploadData
    ) {
        console.log(
            '요청 > Adapter > outBound > repository > createConsultingCompanyProfileTemp > deleteData: ',
            createProfileTempEntity,
            uploadData
        );
        let result;
        try {
            result = await this.db.createConsultingCompanyProfileTemp(
                createProfileTempEntity,
                uploadData
            );
            console.log(
                '응답 > Adapter > outBound > repository > createConsultingCompanyProfileTemp > result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '응답 > Adapter > outBound > repository > createConsultingCompanyProfileTemp > result : ',
                error
            );
            throw error;
        }
    }
    // GET
    async getConsultantProfileTemp(userData) {
        console.log(
            '요청 > Adapter > outBound > repository > getConsultantProfileTemp > userData: ',
            userData
        );
        let result;
        try {
            result = await this.db.getConsultantProfileTemp(userData);
            console.log(
                '응답 > Adapter > outBound > repository > getConsultantProfileTemp > result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '에러 > Adapter > outBound > repository > getConsultantProfileTemp > result : ',
                error
            );
            throw error;
        }
    }
    async getConsultingCompanyProfileTemp(userData) {
        console.log(
            '요청 > Adapter > outBound > repository > getConsultingCompanyProfileTemp > userData: ',
            userData
        );
        let result;
        try {
            result = await this.db.getConsultingCompanyProfileTemp(userData);
            console.log(
                '응답 > Adapter > outBound > repository > getConsultingCompanyProfileTemp > result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '에러 > Adapter > outBound > repository > getConsultingCompanyProfileTemp > result : ',
                error
            );
            throw error;
        }
    }
    // UPDATE
    async updateProfileTemp(deleteData) {
        console.log(
            '요청 > Adapter > outBound > repository > updateProfileTemp > deleteData: ',
            deleteData
        );
        let result;
        try {
            result = await this.db.updateProfileTemp(deleteData);
            console.log(
                '응답 > Adapter > outBound > repository > updateProfileTemp > result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '응답 > Adapter > outBound > repository > updateProfileTemp > result : ',
                error
            );
            throw error;
        }
    }
    // DELETE
    async deleteProfileTemp(userData) {
        console.log(
            '요청 > Adapter > outBound > repository > deleteProfileTemp > userData: ',
            userData
        );
        let result;
        try {
            result = await this.db.deleteProfileTemp(userData);
            console.log(
                '응답 > Adapter > outBound > repository > deleteProfileTemp > result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '응답 > Adapter > outBound > repository > deleteProfileTemp > result : ',
                error
            );
            throw error;
        }
    }
};
