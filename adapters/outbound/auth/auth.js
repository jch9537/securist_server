// infrastructure 연결 메서드 정의 클래스
module.exports = class {
    constructor(authService) {
        this.authService = authService;
    }
    createUser(userEntity) {
        console.log(
            'Adapter > outBound > auth > auth.js - createUser : ',
            userEntity
        );
        return this.authService.createUser(userEntity);
    }
    getUser(email) {
        console.log(
            'Adapter > outBound > auth > auth.js - getUser : ',
            userEntity
        );
        // this.authService.authUser(email);
    }
    confirmUser(email) {
        console.log(
            'Adapter > outBound > auth > auth.js - confirmUser : ',
            email
        );
        return this.authService.confirmUser(email);
    }
};
