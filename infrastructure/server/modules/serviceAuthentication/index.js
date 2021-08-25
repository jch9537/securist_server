const projectServiceUrl = 'http://localhost:5000/api';
const adminServiceUrl = 'http://localhost:5500/api';

const jwt = require('jsonwebtoken');
const axios = require('axios');

const { serviceAuthAdapter } = require('../../../../adapters/inbound');
const { getToken, setToken } = require('../../../database/redis');

const {
    AuthorizationException,
    TypeException,
} = require('../../../../domain/exceptions');

module.exports = {
    //---------------------- 각 서비스에서 받은 요청 처리 ----------------------------

    // 각 서비스 확인 (서비스별 로그인) > 토큰 발급
    async issueToken(req, res, next) {
        let result;
        let reqBodyData = req.filteredBody;
        let storeTokenData = {};
        console.log('토큰 요청정보', reqBodyData);
        let { serviceType, serviceName, servicePassword } = reqBodyData;
        try {
            // 서비스 종류 및 인증 확인
            if (
                serviceType === process.env.ADMIN_SERVICE_TYPE &&
                serviceName === process.env.ADMIN_SERVICE_NAME &&
                servicePassword === process.env.ADMIN_SERVICE_PASSWORD
            ) {
                storeTokenData.tokenKey = process.env.USER_TOKEN_KEY_ADMIN;
            } else if (
                serviceType === process.env.PROJECT_SERVICE_TYPE &&
                serviceName === process.env.PROJECT_SERVICE_NAME &&
                servicePassword === process.env.PROJECT_SERVICE_PASSWORD
            ) {
                storeTokenData.tokenKey = process.env.USER_TOKEN_KEY_PROJECT;
            } else {
                throw new AuthorizationException('서비스');
            }
            // 토큰 생성
            let token = jwt.sign(
                {
                    serviceName: serviceName,
                    serviceType: serviceType,
                },
                process.env.USER_SECRET_KEY,
                {
                    subject: 'jwtUserToken',
                    expiresIn: '5000ms',
                    issuer: 'user_service',
                }
            );
            storeTokenData.token = token;
           
            // 토큰 저장
            await setToken(storeTokenData);

            if (serviceType === 'admin') {
                console.log('어드민 서비스 요청 > 유저 서비스 토큰 발급 완료');
            } else {
                //serviceType === 'project'
                console.log(
                    '프로젝트 서비스 요청 > 유저 서비스 토큰 발급 완료'
                );
            }

            result = {
                message: '토큰 발급 완료',
                data: { token: token },
            };
            req.serviceAuth = result;

            next();
        } catch (error) {
            console.error(error);
            next(error);
        }
    },
    // 토큰 확인
    async verifyToken(req, res, next) {
        let result;
        let tokenKey, currentToken;
        // console.log('요청', req);
        let reqParamData = req.params;
        let { serviceType } = reqParamData;
        let serviceToken = req.filteredToken;
        console.log('서비스 토큰 도착 ', serviceType, serviceToken);

        try {
            if (serviceType === 'admin') {
                // 어드민 서비스 요청
                tokenKey = process.env.USER_TOKEN_KEY_ADMIN;
                currentToken = await getToken(tokenKey);
            } else if (serviceType === 'project') {
                // 프로젝트 서비스 요청
                tokenKey = process.env.USER_TOKEN_KEY_PROJECT;
                currentToken = await getToken(tokenKey);
            } else {
                throw new TypeException('서비스 타입');
            }
            // 토큰 확인
            console.log('서비스 토큰 ', serviceToken);
            console.log('현재 토큰 ', currentToken);
            if (serviceToken !== currentToken) {
                throw new AuthorizationException('서비스');
            }
            console.log('토큰 확인 완료');

            result = {
                message: '토큰 확인 완료',
                data: jwt.verify(serviceToken, process.env.USER_SECRET_KEY),
            };
            req.verifyToken = result;
            next();
        } catch (error) {
            console.error(error);
            next(error);
        }
    },
    // access token이 만료되었을 때 refresh token으로 갱신 처리
    async renewToken() {},

    //------------------------ 프로젝트 서비스 요청/확인 ---------------------------

    async issueTokenByProjectService(req, res, next) {
        let result, response;
        let serviceType = process.env.USER_SERVICE_TYPE;
        let serviceName = process.env.USER_SERVICE_NAME;
        let servicePassword = process.env.USER_SERVICE_PASSWORD;

        try {
            response = await axios({
                url: `${projectServiceUrl}/service/issuetoken`,
                method: 'post',
                data: {
                    serviceName: serviceName,
                    serviceType: serviceType,
                    servicePassword: servicePassword,
                },
            });
            console.log(
                '유저 서비스 : 프로젝트 서비스 토큰 받음 : ',
                response.data
            );

            result = {
                message: '프로젝트 서비스 토큰 요청 완료',
                data: { token: response.data.data.token },
            };
            // redis 토큰 저장 : 하나의 redis를 사용할 경우 필요없음
            let storeTokenData = {
                tokenKey: process.env.PROJECT_TOKEN_KEY_USER,
                token: result.data.token,
            };
            await setToken(storeTokenData);

            console.log('프로젝트 서비스 토큰요청 결과 : ', result);
            next();
        } catch (error) {
            let err = error.response.data;
            console.err(err);
            next(err);
        }
    },
    async verifyTokenByProjectService(req, res, next) {
        let result, response;
        try {
            // 토큰 가져오기
            let myToken = await getToken(process.env.PROJECT_TOKEN_KEY_USER);
            console.log('내 토큰 확인 ', myToken);
            // 프로젝트 서버요청
            response = await axios({
                url: `${projectServiceUrl}/service/verify/user`,
                method: 'get',
                headers: { Authorization: myToken },
            });
            console.log(
                '프로젝트 서비스 > 유저 토큰 인증 완료 : ',
                response.data
            );

            // 응답 확인 & 서비스명이 제대로 왔다면 권한 여부 전달
            if (
                response.data.data &&
                response.data.data.serviceName === process.env.USER_SERVICE_NAME
            ) {
                result = {
                    message: '프로젝트 서비스에서 유저 토큰 인증 완료',
                    data: {
                        isAuthorization: true,
                    },
                };
            } else {
                throw new AuthorizationException('서비스');
            }

            console.log('프로젝트 서비스 토큰 인증 완료 : ', result);
            next();
        } catch (error) {
            console.error('에러 ', error);
            let err = error.data;

            if (err.errMessage === 'jwt expired') {
                // err.errData = {isAuthorization: false} // 필요하면 추가
                await serviceAuthAdapter.issueTokenByProjectService();
                let retryVerifyResult = await serviceAuthAdapter.verifyTokenByProjectService();
                console.log(
                    '프로젝트 서비스 유저 토큰 재인증 완료 : ',
                    retryVerifyResult
                );

                next();
            } else {
                next(err);
            }
        }
    },

    //------------------------ 어드민 서비스 인증 요청/확인 --------------------------

    async issueTokenByAdminService(req, res, next) {
        let result, response;
        let serviceType = process.env.USER_SERVICE_TYPE;
        let serviceName = process.env.USER_SERVICE_NAME;
        let servicePassword = process.env.USER_SERVICE_PASSWORD;

        try {
            response = await axios({
                url: `${adminServiceUrl}/service/issuetoken`,
                method: 'post',
                data: {
                    serviceName: serviceName,
                    serviceType: serviceType,
                    servicePassword: servicePassword,
                },
            });
            console.log(
                '유저 서비스 : 어드민 서비스 토큰 받음 : ',
                response.data
            );

            result = {
                message: '어드민 서비스 토큰 요청 완료',
                data: { token: response.data.data.token },
            };
            // redis 토큰 저장 : 하나의 redis를 사용할 경우 필요없음
            let storeTokenData = {
                tokenKey: process.env.ADMIN_TOKEN_KEY_USER,
                token: result.data.token,
            };
            await setToken(storeTokenData);

            console.log('어드민 서비스 토큰 요청 결과 : ', result);
            next();
        } catch (error) {
            let err = error.response.data;
            console.error(err);
            next(err);
        }
    },
    async verifyTokenByAdminService(req, res, next) {
        let result, response;
        try {
            // 토큰 가져오기
            let myToken = await getToken(process.env.ADMIN_TOKEN_KEY_USER);
            console.log('내토큰 확인 ', myToken);
            // 유저 서버요청
            response = await axios({
                url: `${adminServiceUrl}/service/verify/project`,
                method: 'get',
                headers: { Authorization: myToken },
            });
            console.log(
                '어드민 서비스 > 유저 토큰 인증 완료 : ',
                response.data
            );

            // 응답 확인 & 서비스명이 제대로 왔다면 권한 여부 전달
            if (
                response.data.data &&
                response.data.data.serviceName === process.env.USER_SERVICE_NAME
            ) {
                result = {
                    message: '어드민 서비스에서 유저 토큰 인증 완료',
                    data: {
                        isAuthorization: true,
                    },
                };
            } else {
                throw new AuthorizationException('서비스');
            }

            console.log('어드민 서비스 토큰 인증 완료 : ', result);
            next();
        } catch (error) {
            console.error('에러 ', error);
            let err = error.response.data;

            if (err.errMessage === 'jwt expired') {
                // err.errData = {isAuthorization: false} // 필요하면 추가
                await serviceAuthAdapter.issueTokenByAdminService();
                let retryVerifyResult = await serviceAuthAdapter.verifyTokenByAdminService();
                console.log(
                    '어드민 서비스 유저 토큰 재인증 완료 : ',
                    retryVerifyResult
                );

                next();
            } else {
                next(err);
            }
        }
    },
};
