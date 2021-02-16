const Cognito = require('./awsCognito');
// 클라우드 등록 서비스(aws_cognito, azure_activedirectory 등.. )의 공통적인 내용이 담긴 클래스
module.exports = class {
    constructor() {
        this.cloudAuth = new Cognito();
    }
    createUser() {
        console.log(
            'Infrastructure > webService > authService > index.js - createUser : '
        );
        return this.cloudAuth.cognitoService();
    }
    authUser() {
        console.log(
            'Infrastructure > webService > authService > index.js - authUser : '
        );
    }
    confirmUser(email) {
        console.log(
            'Infrastructure > webService > authService > index.js - confirmUser : ',
            email
        );
        return this.cloudAuth.getUser();
    }
};
