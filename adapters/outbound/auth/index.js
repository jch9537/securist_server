// infrastructure 연결 adapter - 사용자 인증서비스
const Auth = require('./Authentications');
const {
    authService,
} = require('../../../infrastructure/webService/authService');

module.exports = new Auth(authService); //parameter : service
