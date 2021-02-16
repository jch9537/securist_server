//개별 클라우드 인증서비스의 실행클래스 - cognito
module.exports = class {
    constructor() {}
    cognitoService() {
        console.log(
            'Infrastructure > webService > authService > awsCognito.js - cognitoService!! : '
        );
        return 'Cognito Success';
    }
    getUser() {
        console.log(
            'Infrastructure > webService > authService > awsCognito.js - getUser!! : '
        );
        return 'Cognito Success : getUser';
    }
};
