module.exports = class ReissueToken {
    constructor(auth) {
        this.auth = auth;
    }
    async excute(refreshToken) {
        try {
            let reissueTokenInfo = await this.auth.reissueToken(refreshToken);
            return reissueTokenInfo;
        } catch (error) {
            console.error(error);
            // if (!error.authServiceErrorName) {
            //     error.message = '토큰 갱신 실패';
            // }
            // error.message = '토큰 갱신 실패';
            throw error;
        }
    }
};
