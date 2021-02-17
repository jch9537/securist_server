// infrastructure 연결 메서드 정의 클래스
module.exports = class {
    constructor(authService) {
        this.authService = authService;
    }
    createUser(userEntity) {
        console.log(
            '요청 > Adapter > outBound > auth > auth.js - createUser : ',
            userEntity
        );
        return this.authService.createUser(userEntity);
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
};
