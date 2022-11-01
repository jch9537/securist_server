module.exports = class TokenRepository {
    constructor(storage) {
        this.storage = storage;
    }
    async setToken(tokenKey) {
        console.log(
            '요청 > Adapter > outBound > repository > setToken - parameter: '
        );
        try {
            let result = await this.storage.setToken(tokenKey);
            console.log(
                '응답 > Adapter > outBound > repository > setToken > result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '에러 > Adapter > outBound > repository > setToken > error : ',
                error
            );
            throw error;
        }
    }
    async getToken(serviceData) {
        console.log(
            '요청 > Adapter > outBound > repository > getToken - parameter: '
        );
        try {
            let result = await this.storage.getToken(serviceData);
            console.log(
                '응답 > Adapter > outBound > repository > getToken > result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '에러 > Adapter > outBound > repository > getToken > error : ',
                error
            );
            throw error;
        }
    }
};
