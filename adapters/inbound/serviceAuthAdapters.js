const adminServiceUrl = 'http://localhost:5500/api/service';
const projectServiceUrl = 'http://localhost:5000/api/service';

const jwt = require('jsonwebtoken');
const axios = require('axios');

const { serviceRepository } = require('../outbound/repository');
const {
    AuthorizationException,
    TypeException,
} = require('../../domain/exceptions');

module.exports = {
    //--------------------------받은 요청 처리-----------------------------------
    // 각 서비스 확인 (서비스별 로그인) > 토큰 발급
    async issueToken({ serviceType, serviceName, servicePassword }) {
        console.log(
            '토큰발급 어댑터 도착~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
        );
        let result;
        let storeTokenData = {};
        console.log('토큰 요청정보', serviceType, serviceName, servicePassword);
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
            await serviceRepository.setToken(storeTokenData);
            console.log('다시 발급한 토큰 -----------', storeTokenData);

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
            return result;
        } catch (error) {
            throw error;
        }
    },
    // 토큰 확인
    async verifyToken({ serviceType, serviceToken }) {
        console.log(
            '토큰확인 어댑터 도착~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
        );
        let result;
        let tokenKey, currentToken;
        try {
            if (serviceType === 'admin') {
                // 어드민 서비스 요청
                tokenKey = process.env.USER_TOKEN_KEY_ADMIN;
                currentToken = await serviceRepository.getToken(tokenKey);
            } else if (serviceType === 'project') {
                // 프로젝트 서비스 요청
                tokenKey = process.env.USER_TOKEN_KEY_PROJECT;
                currentToken = await serviceRepository.getToken(tokenKey);
            } else {
                throw new TypeException('서비스 타입');
            }
            console.log('서비스 토큰 ', serviceToken);
            console.log('현재 토큰 ', currentToken);
            // 토큰 확인
            if (serviceToken !== currentToken) {
                throw new AuthorizationException('서비스');
            }
            console.log('토큰 확인 완료');

            result = {
                message: '토큰 확인 완료',
                data: jwt.verify(serviceToken, process.env.USER_SECRET_KEY),
            };
            return result;
        } catch (error) {
            throw error;
        }
    },

    // access token이 만료되었을 때 refresh token으로 갱신 처리
    async renewToken(req, res) {},

    //-------------------------------요청보냄-----------------------------------

    async issueTokenByAdminService() {
        let result, response;

        let serviceType = process.env.USER_SERVICE_TYPE;
        let serviceName = process.env.USER_SERVICE_NAME;
        let servicePassword = process.env.USER_SERVICE_PASSWORD;

        try {
            console.log('안녕!!');
            response = await axios({
                url: `${adminServiceUrl}/issuetoken`,
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
                data: { token: response.data.data },
            };
            // redis 토큰 저장 : 하나의 redis를 사용할 경우 필요없음
            let storeTokenData = {
                tokenKey: process.env.ADMIN_TOKEN_KEY_USER,
                token: result.data.token,
            };
            await serviceRepository.setToken(storeTokenData);

            return result;
        } catch (error) {
            let err = error.response.data;
            console.log(err);
            throw err;
        }
    },
    async verifyTokenByAdminService() {
        let result, response;
        try {
            // 토큰 가져오기
            let myToken = await serviceRepository.getToken(
                process.env.ADMIN_TOKEN_KEY_USER
            );
            console.log('내 토큰 확인 ', myToken);
            // 어드민 서버요청
            response = await axios({
                url: `${adminServiceUrl}/verify/user`,
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

            return result;
        } catch (error) {
            console.log('에러 ', error);
            let err = error.response.data;

            if (err.errMessage === 'jwt expired') {
                // err.errData = {isAuthorization: false} // 필요하면 추가
                await this.issueTokenByAdminService();
                let retryVerifyResult = await this.verifyTokenByAdminService();
                return retryVerifyResult;
            } else {
                throw err;
            }
        }
    },
    async issueTokenByProjectService() {
        let result, response;
        let serviceType = process.env.USER_SERVICE_TYPE;
        let serviceName = process.env.USER_SERVICE_NAME;
        let servicePassword = process.env.USER_SERVICE_PASSWORD;

        try {
            response = await axios({
                url: `${projectServiceUrl}/issuetoken`,
                method: 'post',
                data: {
                    serviceName: serviceName,
                    serviceType: serviceType,
                    servicePassword: servicePassword,
                },
            });
            console.log(
                '유저 서비스 : 프로젝트 서비스 토큰 받음 ',
                response.data
            );

            result = {
                message: '프로젝트 서비스 토큰 요청 완료',
                data: { token: response.data.data },
            };
            // redis 토큰 저장 : 하나의 redis를 사용할 경우 필요없음
            let storeTokenData = {
                tokenKey: process.env.PROJECT_TOKEN_KEY_USER,
                token: result.data.token,
            };
            await serviceRepository.setToken(storeTokenData);

            return result;
        } catch (error) {
            let err = error.response.data;
            console.log(err);
            throw err;
        }
    },
    async verifyTokenByProjectService() {
        let result, response;
        try {
            // 토큰 가져오기
            let myToken = await serviceRepository.getToken(
                process.env.PROJECT_TOKEN_KEY_USER
            );
            // myToken += 'a'; // 오류 테스트용
            console.log('내토큰 확인 ', myToken);
            // 프로젝트 서버 요청
            response = await axios({
                url: `${projectServiceUrl}/verify/user`,
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

            return result;
        } catch (error) {
            console.log('에러 ', error);
            let err = error.response.data;

            if (err.errMessage === 'jwt expired') {
                // err.errData = {isAuthorization: false} // 필요하면 추가
                await this.issueTokenByProjectService();
                let retryVerifyResult = await this.verifyTokenByProjectService();
                return retryVerifyResult;
            } else {
                throw err;
            }
        }
    },
    // -------------------------프로젝트 요청----------------------------------

    //-------------------------------------------------------------------------
    // async issueTokenByAdminService() {
    //     let result;
    //     try {
    //         let currentServiceData = {
    //             serviceType: process.env.USER_SERVICE_TYPE,
    //             serviceName: process.env.USER_SERVICE_NAME,
    //             servicePassword: process.env.USER_SERVICE_PASSWORD,
    //         };
    //         result = await serviceRepository.issueTokenByAdminService(
    //             currentServiceData
    //         );
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // },
    // async verifyTokenByAdminService() {
    //     let result;
    //     try {
    //         result = await serviceRepository.verifyTokenByAdminService();
    //         return result;
    //     } catch (error) {
    //         console.log('에러~~~~~~~~~~ : ', error);
    //         throw error;
    //     }
    // },
    // async issueTokenByProjectService() {
    //     let result;
    //     try {
    //         let currentServiceData = {
    //             serviceType: process.env.USER_SERVICE_TYPE,
    //             serviceName: process.env.USER_SERVICE_NAME,
    //             servicePassword: process.env.USER_SERVICE_PASSWORD,
    //         };
    //         result = await serviceRepository.issueTokenByProjectService(
    //             currentServiceData
    //         );
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // },
    // async verifyTokenByProjectService() {
    //     let result;
    //     try {
    //         result = await serviceRepository.verifyTokenByProjectService();
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // },
};
