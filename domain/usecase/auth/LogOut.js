// 로그아웃
module.exports = class LogOut {
    constructor(auth) {
        this.auth = auth;
    }
    async excute(AccessToken) {
        try {
            await this.auth.logOut(AccessToken);
            return;
        } catch (error) {
            console.error(error);
            // if (error.authServiceErrorName === 'NotAuthorizedException') {
            //     // if (error.message === 'Access Token has expired') {
            //     //     // 토큰 만료 : 리프레시 토큰 필요
            //     // } else if (
            //     //     // 토큰 취소 : 로그인 필요
            //     //     error.message === 'Access Token has been revoked'
            //     // ) {
            //     // } else if (error.message === 'Invalid Access Token') {
            //     //     // 유효하지 않은 토큰 : 로그인 필요
            //     // }
            //     error.message = '로그인 후 이용 가능합니다.';
            // } else {
            //     error.message = '로그아웃 실패';
            // }
            throw error;
        }
    }
};
