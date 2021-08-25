module.exports = class {
    constructor(auth) {
        this.auth = auth;
    }
    async excute(refreshToken) {
        let result, response;
        try {
            response = await this.auth.issueNewToken(refreshToken);

            result = {
                message: '토큰 갱신 완료',
                data: response,
            };
            return result;
        } catch (error) {
            console.error(error);
            // if (!error.authServiceErrorName) {
            //     error.message = '토큰 갱신 실패';
            // }
            error.message = '토큰 갱신 실패';
            throw error;
        }
    }
};
