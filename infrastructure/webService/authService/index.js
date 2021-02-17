const Cognito = require('./awsCognito');
// 클라우드 등록 서비스(aws_cognito, azure_activedirectory 등.. )의 공통적인 내용이 담긴 클래스
module.exports = class {
    constructor() {
        this.cloudAuth = new Cognito();
    }
    createUser() {
        console.log(
            '요청 > Infrastructure > webService > authService > index.js - createUser : '
        );
        return this.cloudAuth.cognitoService();
    }
    authUser() {
        console.log(
            '요청 > Infrastructure > webService > authService > index.js - authUser : '
        );
    }
    async confirmUser(email) {
        console.log(
            '요청 > Infrastructure > webService > authService > index.js - confirmUser > email : ',
            email
        );
        let result = await this.cloudAuth.getEmail(email);
        console.log(
            '응답 > Infrastructure > webService > authService > index.js - confirmUser > result : ',
            result
        );
        return result;
    }
};
