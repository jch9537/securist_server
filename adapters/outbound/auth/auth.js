// infrastructure 연결 메서드 정의 클래스
module.exports = class {
    constructor(authService) {
        this.authService = authService;
    }
    signUp(userEntity) {
        console.log(
            '요청 > Adapter > outBound > auth > auth.js - signUp : ',
            userEntity
        );
        return this.authService.signUp(userEntity);
    }
    createUser(userEntity) {
        console.log(
            '요청 > Adapter > outBound > auth > auth.js > createUser - userEntity : ',
            userEntity
        );
        let result = this.authService.createUser(userEntity);
        console.log(
            '응답 > Adapter > outBound > auth > auth.js > createUser - result: ',
            result
        );
        return result;
    }
    getUser(email) {
        console.log(
            '요청 > Adapter > outBound > auth > auth.js - getUser : ',
            userEntity
        );
        // this.authService.authUser(email);
    }
    async confirmUser(email) {
        console.log(
            '요청 > Adapter > outBound > auth > auth.js - confirmUser > email : ',
            email
        );
        let result = await this.authService.confirmUser(email);
        console.log(
            '응답 > Adapter > outBound > auth > auth.js - confirmUser > result : ',
            result
        );
        return result;
    }
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
