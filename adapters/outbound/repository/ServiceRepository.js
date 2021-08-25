module.exports = class {
    constructor(storage) {
        this.storage = storage;
    }
    async getToken(tokenKey) {
        console.log(
            '요청 > Adapter > outBound > repository > getToken - parameter: '
        );
        try {
            let result = await this.storage.getToken(tokenKey);
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
    async setToken(serviceData) {
        console.log(
            '요청 > Adapter > outBound > repository > setToken - parameter: ',
            serviceData
        );
        try {
            let result = await this.storage.setToken(serviceData);
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

    // async issueTokenByAdminService(currentServiceData) {
    //     console.log(
    //         '요청 > Adapter > outBound > repository > issueTokenByAdminService - parameter: '
    //     );
    //     try {
    //         let result = await this.storage.issueTokenByAdminService(
    //             currentServiceData
    //         );
    //         console.log(
    //             '응답 > Adapter > outBound > repository > issueTokenByAdminService > result : ',
    //             result
    //         );
    //         return result;
    //     } catch (error) {
    //         console.log(
    //             '에러 > Adapter > outBound > repository > issueTokenByAdminService > error : ',
    //             error
    //         );
    //         throw error;
    //     }
    // }
    // async verifyTokenByAdminService(currentServiceData) {
    //     console.log(
    //         '요청 > Adapter > outBound > repository > verifyTokenByAdminService - parameter: '
    //     );
    //     try {
    //         let result = await this.storage.verifyTokenByAdminService(
    //             currentServiceData
    //         );
    //         console.log(
    //             '응답 > Adapter > outBound > repository > verifyTokenByAdminService > result : ',
    //             result
    //         );
    //         return result;
    //     } catch (error) {
    //         console.log(
    //             '에러 > Adapter > outBound > repository > verifyTokenByAdminService > error : ',
    //             error
    //         );
    //         throw error;
    //     }
    // }
    // async issueTokenByProjectService(currentServiceData) {
    //     console.log(
    //         '요청 > Adapter > outBound > repository > issueTokenByProjectService - parameter: '
    //     );
    //     try {
    //         let result = await this.storage.issueTokenByProjectService(
    //             currentServiceData
    //         );
    //         console.log(
    //             '응답 > Adapter > outBound > repository > issueTokenByProjectService > result : ',
    //             result
    //         );
    //         return result;
    //     } catch (error) {
    //         console.log(
    //             '에러 > Adapter > outBound > repository > issueTokenByProjectService > error : ',
    //             error
    //         );
    //         throw error;
    //     }
    // }
    // async verifyTokenByProjectService(currentServiceData) {
    //     console.log(
    //         '요청 > Adapter > outBound > repository > verifyTokenByProjectService - parameter: '
    //     );
    //     try {
    //         let result = await this.storage.verifyTokenByProjectService(
    //             currentServiceData
    //         );
    //         console.log(
    //             '응답 > Adapter > outBound > repository > verifyTokenByProjectService > result : ',
    //             result
    //         );
    //         return result;
    //     } catch (error) {
    //         console.log(
    //             '에러 > Adapter > outBound > repository > verifyTokenByProjectService > error : ',
    //             error
    //         );
    //         throw error;
    //     }
    // }
};
