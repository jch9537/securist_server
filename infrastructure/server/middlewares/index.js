module.exports = {
    sanitizer: require('./sanitizer'), // 태그제거 : XSS 방어
    extractToken: require('./extractToken'), // 순수 토큰 추출 - 토큰 타입 제거
    decryptIdToken: require('./decryptIdToken'), // ID Token 복호화
    verifyServiceToken: require('./verifyServiceToken'), // 타 서비스 요청 시 토큰 확인
    decryptAccessToken: require('./decryptAccessToken'),
    // getUserInfoByAccessToken: require('./getUserInfoByAccessToken'),
};
