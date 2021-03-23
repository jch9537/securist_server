const Middleware1 = require('./middleware1');

module.exports = new Middleware1(parameter);

/*
토큰 처리함수 (아래 함수들 모음)
- access 토큰만료기간확인 함수 > 만료여부 확인 > 응답
- access 토큰 갱신 함수 > refresh 토큰 만료 ? 로그인 페이지 : access token 갱신 후 응답

 */
