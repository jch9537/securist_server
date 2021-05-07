// infrastructure 연결 메서드 정의 클래스
module.exports = class {
    constructor(authService) {
        this.authService = authService;
    }
    async checkDuplicateEmail(userEntity) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication >  - checkDuplicateEmail > userEntity : ',
            userEntity
        );
        let result = await this.authService.checkExistEmail(userEntity);
        console.log(
            '응답 > Adapter > outBound > auth > authentication >  - checkDuplicateEmail > result : ',
            result
        );
        return result;
    }
    async logIn(userEntity) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication >  - logIn : ',
            userEntity
        );
        let result = await this.authService.logIn(userEntity);
        console.log(
            '응답 > Adapter > outBound > auth > authentication >  - logIn : ',
            result
        );
        return result;
    }
    async logOut(accessToken) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication >  - logOut : '
            // accessToken
        );
        let result = await this.authService.logOut(accessToken);
        console.log(
            '응답 > Adapter > outBound > auth > authentication >  - logOut : ',
            result
        );
        return result;
    }
    async verifyUserByPassword(userEntity) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication >  - verifyUserByPassword : '
            // userEntity
        );
        let result = await this.authService.verifyUserByPassword(userEntity);
        console.log(
            '응답 > Adapter > outBound > auth > authentication >  - verifyUserByPassword : ',
            result
        );
        return result;
    }
    async changePassword(userEntity) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication >  - changePassword : '
            // userEntity
        );
        let result = await this.authService.changePassword(userEntity);
        console.log(
            '응답 > Adapter > outBound > auth > authentication >  - changePassword : ',
            result
        );
        return result;
    }
    async forgotPassword(userEntity) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication >  - forgotPassword : '
            // userEntity
        );
        let result = await this.authService.forgotPassword(userEntity);
        console.log(
            '응답 > Adapter > outBound > auth > authentication >  - forgotPassword : ',
            result
        );
        return result;
    }

    async confirmForgotPassword(userEntity) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication >  - confirmForgotPassword : '
            // {email, code, password}
        );
        let result = await this.authService.confirmForgotPassword(userEntity);
        console.log(
            '응답 > Adapter > outBound > auth > authentication >  - confirmForgotPassword : ',
            result
        );
        return result;
    }

    // async resetRetryCount(token) {
    //     console.log(
    //         '요청 > Adapter > outBound > auth > authentication >  - resetLogInCount : ',
    //         token
    //     );
    //     let result = await this.authService.resetRetryCount(token);
    //     console.log(
    //         '응답 > Adapter > outBound > auth > authentication >  - resetLogInCount : ',
    //         result
    //     );
    //     return result;
    // }

    // async getRetryCount(email) {
    //     console.log(
    //         '요청 > Adapter > outBound > auth > authentication >  - getRetryCount : ',
    //         email
    //     );
    //     let count = await this.authService.getRetryCount(email);
    //     console.log(
    //         '응답 > Adapter > outBound > auth > authentication >  - getRetryCount : ',
    //         count
    //     );
    //     return count;
    // }

    // async setRetryCount(email, count) {
    //     console.log(
    //         '요청 > Adapter > outBound > auth > authentication >  - setRetryCount : ',
    //         email,
    //         count
    //     );
    //     let result = await this.authService.setRetryCount(email, count);
    //     console.log(
    //         '응답 > Adapter > outBound > auth > authentication >  - setRetryCount : ',
    //         result
    //     );
    //     return result;
    // }
    async checkAccessToken(accessToken) {
        // 미들웨어 처리 할지 확인!!!
        console.log(
            '요청 > Adapter > outBound > auth > authentication >  - checkAccessToken : '
            // accessToken
        );
        let result = await this.authService.checkAccessToken(accessToken);
        console.log(
            '응답 > Adapter > outBound > auth > authentication >  - checkAccessToken : ',
            result
        );
        return result;
    }
    async issueNewToken(refreshToken) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication >  - issueNewToken : ',
            refreshToken
        );
        let result = await this.authService.issueNewToken(refreshToken);
        console.log(
            '응답 > Adapter > outBound > auth > authentication >  - issueNewToken : ',
            result
        );
        return result;
    }
    async getUserByIdToken(idToken) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication >  - idToken : ',
            idToken
        );
        let result = await this.authService.getUserByIdToken(idToken);
        console.log(
            '응답 > Adapter > outBound > auth > authentication >  - result : ',
            result
        );
        return result;
    }
    async getUserInfoByAccessToken(accessToken) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication > getUserInfoByAccessToken >  accesstoken : ',
            accessToken
        );
        let result = await this.authService.getUserInfoByAccessToken(
            accessToken
        );
        console.log(
            '응답 > Adapter > outBound > auth > authentication > getUserInfoByAccessToken >  result : ',
            result
        );
        return result;
    }

    // async getUserInfo(token) {
    //     console.log(
    //         '요청 > Adapter > outBound > auth > authentication >  - getUserInfo : '
    //         // token
    //     );
    //     let result = await this.authService.getUserInfo(token);
    //     console.log(
    //         '응답 > Adapter > outBound > auth > authentication >  - getUserInfo : ',
    //         result
    //     );
    //     return result;
    // }
    // createUser(userEntity) {
    //     console.log(
    //         '요청 > Adapter > outBound > auth > auth.js > createUser - userEntity : ',
    //         userEntity
    //     );
    //     let result = this.authService.createUser(userEntity);
    //     console.log(
    //         '응답 > Adapter > outBound > auth > auth.js > createUser - result: ',
    //         result
    //     );
    //     return result;
    // }
    // getUser(email) {
    //     console.log(
    //         '요청 > Adapter > outBound > auth > auth.js - getUser : ',
    //         userEntity
    //     );
    //     // this.authService.authUser(email);
    // }

    // async confirmUser(email) {
    //     console.log(
    //         '요청 > Adapter > outBound > auth > auth.js - confirmUser > email : ',
    //         email
    //     );
    //     let result = await this.authService.confirmUser(email);
    //     console.log(
    //         '응답 > Adapter > outBound > auth > auth.js - confirmUser > result : ',
    //         result
    //     );
    //     return result;
    // }
    async deleteUserByAdmin(id) {
        console.log(
            '요청 > Adapter > outBound > auth > auth.js - deleteUserByAdmin > id : ',
            id
        );
        let result = await this.authService.deleteUserByAdmin(id);
        console.log(
            '응답 > Adapter > outBound > auth > auth.js - deleteUserByAdmin > result : ',
            result
        );
        return result;
    }
};
