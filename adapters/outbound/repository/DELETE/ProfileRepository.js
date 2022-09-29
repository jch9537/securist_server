module.exports = class {
    constructor(db) {
        this.db = db;
    }
    // 개인 컨설턴트 프로필 인증 요청 : 프로필 정보 생성
    async createConsultantProfile(createProfileTempEntity, uploadData) {
        console.log(
            '요청 > Adapter > outBound > repository > createConsultantProfile > createProfileTempEntity: ',
            createProfileTempEntity,
            uploadData
        );
        let result;
        try {
            result = await this.db.createConsultantProfile(
                createProfileTempEntity,
                uploadData
            );
            console.log(
                '응답 > Adapter > outBound > repository > createConsultantProfile > result : ',
                result
            );
            return result;
        } catch (error) {
            console.error(
                '에러 > Adapter > outBound > repository > createConsultantProfile > result : ',
                error
            );
            throw error;
        }
    }
    // 컨설팅 업체 프로필 인증 요청 : 프로필 정보 생성
    async createConsultingCompanyProfile(createProfileTempEntity, uploadData) {
        console.log(
            '요청 > Adapter > outBound > repository > createConsultingCompanyProfile > deleteData: ',
            createProfileTempEntity,
            uploadData
        );
        let result;
        try {
            result = await this.db.createConsultingCompanyProfile(
                createProfileTempEntity,
                uploadData
            );
            console.log(
                '응답 > Adapter > outBound > repository > createConsultingCompanyProfile > result : ',
                result
            );
            return result;
        } catch (error) {
            console.error(
                '에러 > Adapter > outBound > repository > createConsultingCompanyProfile > result : ',
                error
            );
            throw error;
        }
    }
    // 클라이언트 프로필 인증 요청 : 사용자/기업 정보 수정
    async requestClientAuth(userEntity, uploadData) {
        console.log(
            '요청 > Adapter > outBound > repository > requestClientAuth > userEntity : ',
            uploadData,
            userEntity,
            uploadData
        );
        let result;
        try {
            result = await this.db.requestClientAuth(userEntity, uploadData);
            console.log(
                '응답 > Adapter > outBound > repository > requestClientAuth > result : ',
                result
            );
            return result;
        } catch (error) {
            console.error(
                '에러 > Adapter > outBound > repository > requestClientAuth > result : ',
                error
            );
            throw error;
        }
    }
    // 개인 컨설턴트 프로필 임시저장 : 프로필 임시정보 생성
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
            console.error(
                '에러 > Adapter > outBound > repository > createConsultantProfileTemp > result : ',
                error
            );
            throw error;
        }
    }
    // 기업 프로필 임시저장 : 프로필 임시정보 생성
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
            console.error(
                '에러 > Adapter > outBound > repository > createConsultingCompanyProfileTemp > result : ',
                error
            );
            throw error;
        }
    }
    // 프로필 임시저장 데이터 유뮤 확인
    async checkProfileTempExist(userData) {
        console.log(
            '요청 > Adapter > outBound > repository > checkProfileTempExist > userData: ',
            userData
        );
        let result;
        try {
            result = await this.db.checkProfileTempExist(userData);
            console.log(
                '응답 > Adapter > outBound > repository > checkProfileTempExist > result : ',
                result
            );
            return result;
        } catch (error) {
            console.error(
                '에러 > Adapter > outBound > repository > checkProfileTempExist > result : ',
                error
            );
            throw error;
        }
    }

    // 개인 컨설턴트 프로필 정보 가져오기
    async getConsultantProfile(userData) {
        console.log(
            '요청 > Adapter > outBound > repository > getConsultantProfile > userData: ',
            userData
        );
        let result;
        try {
            result = await this.db.getConsultantProfile(userData);
            console.log(
                '응답 > Adapter > outBound > repository > getConsultantProfile > result : ',
                result
            );
            return result;
        } catch (error) {
            console.error(
                '에러 > Adapter > outBound > repository > getConsultantProfile > result : ',
                error
            );
            throw error;
        }
    }
    // 컨설팅 기업 프로필 정보 가져오기
    async getConsultingCompanyProfile(userData) {
        console.log(
            '요청 > Adapter > outBound > repository > getConsultingCompanyProfile > userData: ',
            userData
        );
        let result;
        try {
            result = await this.db.getConsultingCompanyProfile(userData);
            console.log(
                '응답 > Adapter > outBound > repository > getConsultingCompanyProfile > result : ',
                result
            );
            return result;
        } catch (error) {
            console.error(
                '에러 > Adapter > outBound > repository > getConsultingCompanyProfile > result : ',
                error
            );
            throw error;
        }
    }
    // 개인 컨설턴트 프로필 임시저장 정보 가져오기
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
            console.error(
                '에러 > Adapter > outBound > repository > getConsultantProfileTemp > result : ',
                error
            );
            throw error;
        }
    }
    // 컨설팅 기업 프로필 임시저장 정보 가져오기
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
            console.error(
                '에러 > Adapter > outBound > repository > getConsultingCompanyProfileTemp > result : ',
                error
            );
            throw error;
        }
    }
    // // 프로필 임시저장 정보 수정 : 수정없이 삭제 후 새로 생성
    // async updateProfileTemp(deleteData) {}

    // 프로필 임시저장 정보 삭제 : 컨설턴트 (개인/기업) 공통
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
            console.error(
                '에러 > Adapter > outBound > repository > deleteProfileTemp > result : ',
                error
            );
            throw error;
        }
    }
};
