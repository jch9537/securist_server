const jwt = require('jsonwebtoken');
const axios = require('axios');
const { getToken, setToken } = require('./index');
const { TokenError, ServiceAuthenticationError } = require('../../error');
const adminServiceUrl = 'http://localhost:5500';
const projectServiceUrl = 'http://localhost:5000';

module.exports = class {
    constructor() {}
    async issueToken({ serviceType, serviceName, servicePassword }) {
        let result = {};
        let message, tokenKey;
        console.log('토큰발행');
        // 서비스 종류 확인
        try {
            if (
                serviceType === process.env.ADMIN_SERVICE_TYPE &&
                serviceName === process.env.ADMIN_SERVICE_NAME &&
                servicePassword === process.env.ADMIN_SERVICE_PASSWORD
            ) {
                message = '어드민 서비스에서 요청 > 유저 서비스 인증완료';
                tokenKey = process.env.USER_TOKEN_KEY_ADMIN;
            } else if (
                serviceType === process.env.PROJECT_SERVICE_TYPE &&
                serviceName === process.env.PROJECT_SERVICE_NAME &&
                servicePassword === process.env.PROJECT_SERVICE_PASSWORD
            ) {
                message = '프로젝트 서비스에서 요청 > 유저 서비스 인증완료';
                tokenKey = process.env.USER_TOKEN_KEY_PROJECT;
            } else {
                throw new ServiceAuthenticationError('유저 서비스');
            }
            let token = jwt.sign(
                {
                    serviceName: serviceName,
                    serviceType: serviceType,
                },
                process.env.USER_SECRET_KEY,
                {
                    subject: 'jwtUserToken',
                    expiresIn: '1h',
                    issuer: 'user_service',
                }
            );
            // let refreshToken =
            // 토큰 저장
            setToken(tokenKey, token);
            // 토큰 반환
            result.message = message;
            result.token = token;

            return result;
        } catch (error) {
            throw error;
        }
    }
    async verifyToken({ serviceType, serviceToken }) {
        let result = {};
        try {
            console.log('토큰확인');
            if (serviceType === 'admin') {
                // 유저 서비스 요청
                let tokenKey = process.env.USER_TOKEN_KEY_ADMIN;
                let currentUserToken = await getToken(tokenKey);
                if (serviceToken !== currentUserToken) {
                    console.log('확인!!!');
                    throw new TokenError(
                        'Invalid Token',
                        '사용할 수 없는 토큰입니다.'
                    );
                }
            } else {
                // 프로젝트 서비스 요청 : serviceType === 'project'
                let tokenKey = process.env.USER_TOKEN_KEY_PROJECT;
                let currentUserToken = await getToken(tokenKey);
                if (serviceToken !== currentUserToken) {
                    console.log('확인!!!');
                    throw new TokenError(
                        'Invalid Token',
                        '사용할 수 없는 토큰입니다.'
                    );
                }
            }
            result.data = jwt.verify(serviceToken, process.env.USER_SECRET_KEY);
            result.message = '토큰 확인 완료';
            // console.log('타 서비스에서 받은 토큰으로 처리한 정보 : ', result);
            return result;
        } catch (error) {
            throw error;
        }
    }
    async issueTokenByAdminService({
        serviceType,
        serviceName,
        servicePassword,
    }) {
        let result;
        try {
            console.log('안녕!!');
            result = await axios({
                url: `${adminServiceUrl}/service/issuetoken`,
                method: 'post',
                data: {
                    serviceName: serviceName,
                    serviceType: serviceType,
                    servicePassword: servicePassword,
                },
            });
            console.log(
                '유저에서 생성한 토큰을 어드민에서 받음 : ',
                result.data
            );
            return result.data;
        } catch (error) {
            throw error;
        }
    }
    async verifyTokenByAdminService() {
        let result;
        try {
            // 토큰 가져오기
            let myToken = await getToken(process.env.ADMIN_TOKEN_KEY_USER);
            console.log('유저 토큰 확인 ', myToken);
            result = await axios({
                url: `${adminServiceUrl}/service/verify/user`,
                method: 'get',
                headers: { Authorization: myToken },
            });
            console.log('어드민 > 유저 토큰 보냄 결과: ', result.data);
            return result.data;
        } catch (error) {
            throw error;
        }
    }
    async issueTokenByProjectService({
        serviceType,
        serviceName,
        servicePassword,
    }) {
        let result;
        try {
            result = await axios({
                url: `${projectServiceUrl}/service/issuetoken`,
                method: 'post',
                data: {
                    serviceName: serviceName,
                    serviceType: serviceType,
                    servicePassword: servicePassword,
                },
            });
            console.log(
                '프로젝트에서 생성한 토큰을 어드민에서 받음 : ',
                result.data
            );
            return result.data;
        } catch (error) {
            throw error;
        }
    }
    async verifyTokenByProjectService() {
        let result;
        try {
            // 토큰 가져오기
            let myToken = await getToken(process.env.PROJECT_TOKEN_KEY_USER);
            // myToken += 'a';
            console.log('유저 토큰 확인 ', myToken);
            result = await axios({
                url: `${projectServiceUrl}/service/verify/user`,
                method: 'get',
                headers: { Authorization: myToken },
            });
            console.log('어드민 > 유저 토큰 보냄 결과: ', result.data);
            return result.data;
        } catch (error) {
            throw error;
        }
    }
};
