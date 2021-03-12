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
        let result = await this.authService.checkDuplicateEmail(email);
        console.log(
            '응답 > Adapter > outBound > auth > authentication.js - checkDuplicateEmail > result : ',
            result
        );
        return result;
    }
    async signUp(userEntity) {
        console.log(
            '요청 > Adapter > outBound > auth > auth.js - signUp : ',
            userEntity
        );
        let result = await this.authService.signUp(userEntity);
        console.log(
            '응답 > Adapter > outBound > auth > auth.js - signUp > result : ',
            result
        );
        return result;
    }
    async logIn(userEntity) {
        console.log(
            '요청 > Adapter > outBound > auth > auth.js - logIn : ',
            userEntity
        );
        let result = await this.authService.logIn(userEntity);
        console.log(
            '응답 > Adapter > outBound > auth > auth.js - logIn : ',
            result
        );
        return result;
    }
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
