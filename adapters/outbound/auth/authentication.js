// infrastructure 연결 메서드 정의 클래스
module.exports = class {
    constructor(authService) {
        this.authService = authService;
    }
    async checkDuplicateEmail(email) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication.js - checkDuplicateEmail > email : ',
            email
        );
        let result = await this.authService.checkExistEmail(email);
        console.log(
            '응답 > Adapter > outBound > auth > authentication.js - checkDuplicateEmail > result : ',
            result
        );
        return result;
    }
    async signUp(userEntity) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication.js - signUp : ',
            userEntity
        );
        let result = await this.authService.signUp(userEntity);
        console.log(
            '응답 > Adapter > outBound > auth > authentication.js - signUp > result : ',
            result
        );
        return result;
    }
    async logIn(userEntity) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication.js - logIn : ',
            userEntity
        );
        let result = await this.authService.logIn(userEntity);
        console.log(
            '응답 > Adapter > outBound > auth > authentication.js - logIn : ',
            result
        );
        return result;
    }
    async logOut(token) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication.js - logOut : '
            // token
        );
        let result = await this.authService.logOut(token);
        console.log(
            '응답 > Adapter > outBound > auth > authentication.js - logOut : ',
            result
        );
        return result;
    }
    async checkAccessToken(token) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication.js - checkAccessToken : '
            // token
        );
        let result = await this.authService.checkAccessToken(token);
        console.log(
            '응답 > Adapter > outBound > auth > authentication.js - checkAccessToken : ',
            result
        );
        return result;
    }
    async changePassword(userEntity) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication.js - changePassword : '
            // email
        );
        let result = await this.authService.changePassword(userEntity);
        console.log(
            '응답 > Adapter > outBound > auth > authentication.js - changePassword : ',
            result
        );
        return result;
    }
    async forgotPassword(email) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication.js - forgotPassword : '
            // email
        );
        let result = await this.authService.forgotPassword(email);
        console.log(
            '응답 > Adapter > outBound > auth > authentication.js - forgotPassword : ',
            result
        );
        return result;
    }

    async confirmForgotPassword(userEntity) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication.js - confirmForgotPassword : '
            // {email, code, password}
        );
        let result = await this.authService.confirmForgotPassword(userEntity);
        console.log(
            '응답 > Adapter > outBound > auth > authentication.js - confirmForgotPassword : ',
            result
        );
        return result;
    }

    // async resetRetryCount(token) {
    //     console.log(
    //         '요청 > Adapter > outBound > auth > authentication.js - resetLogInCount : ',
    //         token
    //     );
    //     let result = await this.authService.resetRetryCount(token);
    //     console.log(
    //         '응답 > Adapter > outBound > auth > authentication.js - resetLogInCount : ',
    //         result
    //     );
    //     return result;
    // }

    async getRetryCount(email) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication.js - getRetryCount : ',
            email
        );
        let count = await this.authService.getRetryCount(email);
        console.log(
            '응답 > Adapter > outBound > auth > authentication.js - getRetryCount : ',
            count
        );
        return count;
    }
    async setRetryCount(email, count) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication.js - setRetryCount : ',
            email,
            count
        );
        let result = await this.authService.setRetryCount(email, count);
        console.log(
            '응답 > Adapter > outBound > auth > authentication.js - setRetryCount : ',
            result
        );
        return result;
    }

    async issueNewToken(refreshToken) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication.js - issueNewToken : ',
            refreshToken
        );
        let result = await this.authService.issueNewToken(refreshToken);
        console.log(
            '응답 > Adapter > outBound > auth > authentication.js - issueNewToken : ',
            result
        );
        return result;
    }
    async getUserByIdToken(idToken) {
        console.log(
            '요청 > Adapter > outBound > auth > authentication.js - idToken : ',
            idToken
        );
        let result = await this.authService.getUserByIdToken(idToken);
        console.log(
            '응답 > Adapter > outBound > auth > authentication.js - result : ',
            result
        );
        return result;
    }

    // async getUserInfo(token) {
    //     console.log(
    //         '요청 > Adapter > outBound > auth > authentication.js - getUserInfo : '
    //         // token
    //     );
    //     let result = await this.authService.getUserInfo(token);
    //     console.log(
    //         '응답 > Adapter > outBound > auth > authentication.js - getUserInfo : ',
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
