const jwt = require('jsonwebtoken');

const { tokenRepository } = require('../outbound/repository');
const {
    AuthorizationException,
    TypeException,
} = require('../../domain/exceptions');

module.exports = class ServicesAdapter {
    constructor() {}
    //--------------------------받은 요청 처리-----------------------------------
    // 각 서비스 확인 (서비스별 로그인) > 토큰 발급
    async issueToken({ serviceType, serviceName, servicePassword }) {
        const storeTokenData = {};
        console.log('토큰 요청정보', serviceType, serviceName, servicePassword);

        try {
            // 서비스 종류 및 인증 확인
            if (
                serviceType === process.env.ADMIN_SERVICE_TYPE &&
                serviceName === process.env.ADMIN_SERVICE_NAME &&
                servicePassword === process.env.ADMIN_SERVICE_PASSWORD
            ) {
                storeTokenData.key = process.env.USER_TOKEN_KEY_ADMIN;
            } else if (
                serviceType === process.env.PROJECT_SERVICE_TYPE &&
                serviceName === process.env.PROJECT_SERVICE_NAME &&
                servicePassword === process.env.PROJECT_SERVICE_PASSWORD
            ) {
                storeTokenData.key = process.env.USER_TOKEN_KEY_PROJECT;
            } else {
                throw new AuthorizationException('서비스');
            }
            // 토큰 생성
            const token = jwt.sign(
                {
                    serviceName: serviceName,
                    serviceType: serviceType,
                },
                process.env.USER_SECRET_KEY,
                {
                    subject: 'jwtUserToken',
                    expiresIn: `${1000}ms`,
                    issuer: 'user_service',
                }
            );
            storeTokenData.value = token;

            // 토큰 저장
            await tokenRepository.setToken(storeTokenData);
            console.log('다시 발급한 토큰 -----------', storeTokenData);

            if (serviceType === 'admin') {
                console.log('어드민 서버 요청 > 유저 서버 토큰 발급 완료');
            } else {
                //serviceType === 'project'
                console.log('프로젝트 서버 요청 > 유저 서버 토큰 발급 완료');
            }

            // result = {
            //     message: '토큰 발급 완료',
            //     data: { token: token },
            // };
            const result = {
                token: token,
            };
            return result;
        } catch (error) {
            throw error;
        }
    }
};
