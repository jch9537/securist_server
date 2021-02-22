// infrastructure 연결 adapter - 사용자 인증서비스
const Auth = require('./auth');
const AuthService = require('../../../infrastructure/webService/authService/awsCognito');

const authService = new AuthService();

module.exports = new Auth(authService); //parameter : service
