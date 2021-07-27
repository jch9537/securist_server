const jwt = require('jsonwebtoken');
const axios = require('axios');

const { ServiceAuthenticationError, TokenError } = require('../../../error');

module.exports = {
    //--------------------------받은 요청 처리-----------------------------------

    // 각 서비스 확인 (서비스별 로그인) > 토큰 발급
    async issueToken(req, res, next) {
        let result;
        try {
            let reqBodyData = req.filteredBody;
            console.log('타 서비스 토큰 요청 데이터 ', reqData);
            // 서비스 종류 확인
            if (reqData.serviceType === process.env.ADMIN_SERVICE_TYPE) {
                // 서비스 이름/비번 확인
                if (
                    reqData.serviceName === process.env.ADMIN_SERVICE_NAME &&
                    reqData.servicePassword ===
                        process.env.ADMIN_SERVICE_PASSWORD
                ) {
                    console.log('도착');
                    // 토큰 생성
                    var token = jwt.sign(
                        {
                            serviceName: reqData.serviceName,
                            serviceType: reqData.serviceType,
                        },
                        process.env.USER_SECRET_KEY,
                        {
                            subject: 'jwtUserToken',
                            expiresIn: '1h',
                            issuer: 'user_service',
                        }
                    );
                    console.log(
                        '어드민 서비스에서 인증 요청- 토큰생성 : ',
                        token
                    );
                    // 토큰 반환
                    result = {
                        message:
                            '어드민 서비스에서 요청 > 유저 서비스 인증완료',
                        token: token,
                    };
                } else {
                    throw new ServiceAuthenticationError();
                }
            } else if (
                reqData.serviceType === process.env.PROJECT_SERVICE_TYPE
            ) {
                if (
                    reqData.serviceName === process.env.PROJECT_SERVICE_NAME &&
                    reqData.servicePassword ===
                        process.env.PROJECT_SERVICE_PASSWORD
                ) {
                    var token = jwt.sign(
                        {
                            serviceName: reqData.serviceName,
                            serviceType: reqData.serviceType,
                        },
                        process.env.USER_SECRET_KEY,
                        {
                            subject: 'jwtUserToken',
                            expiresIn: '1h',
                            issuer: 'user_service',
                        }
                    );
                    console.log(
                        '프로젝트 서비스에서 인증 요청 - 토큰 생성 : ',
                        token
                    );
                    result = {
                        message:
                            '프로젝트에서 서비스 요청 > 유저 서비스 인증완료',
                        token: token,
                    };
                } else {
                    throw new ServiceAuthenticationError();
                }
            } else {
                throw new ServiceAuthenticationError();
            }
            req.serviceToken = result;
            next();
        } catch (error) {
            throw error;
        }
    },
    // 토큰 확인
    async verifyToken(req, res, next) {
        try {
            let response;
            let reqToken = req.filteredToken;
            let serviceInfo = jwt.verify(reqToken, process.env.USER_SECRET_KEY);
            console.log(
                '토큰 프로젝트에서 받은 토큰으로 처리한 정보 : ',
                serviceInfo
            );
            req.serviceData = serviceInfo;
            next();
        } catch (error) {
            throw error;
            // response = new TokenError(error);
            // res.send(error);
        }
    },
    // access token이 만료되었을 때 refresh token으로 갱신 처리
    async renewToken(req, res) {},

    //-------------------------------요청보냄-----------------------------------

    async issueTokenByAdminService(req, res, next) {
        try {
            // 연결 - 에러 확인
            // 여기 코드를 미들웨어로 정리
            result = await axios({
                url: `http://localhost:5500/service/issuetoken`,
                method: 'post',
                data: {
                    serviceName: process.env.USER_SERVICE_NAME,
                    serviceType: process.env.USER_SERVICE_TYPE,
                    servicePassword: process.env.USER_SERVICE_PASSWORD,
                },
            });
            console.log(
                '어드민에서 생성한 토큰을 유저에서 받음 : ',
                result.data
            );
            req.adminToken = result.data;
            // res.send(result.data);
            next();
        } catch (error) {
            throw error;
        }
    },
    async verifyTokenByAdminService(req, res, next) {
        try {
            console.log('유저 > 어드민 토큰 보냄 : ', req.filteredToken);
            // 연결 - 에러 확인
            // 여기 코드를 미들웨어로 정리
            result = await axios({
                url: `http://localhost:5500/service/verify`,
                method: 'get',
                headers: { Authorization: req.filteredToken },
            });
            console.log('유저 > 어드민 토큰 보냄 결과 : ', result.data);
            req.userTokenDecryptData = result.data;
            // 여기서 result.data.message에서 토큰 만료가 뜨면 토큰 재발급 또는 리프레시토큰 보냄
            next();
        } catch (error) {
            console.log('에러 : ', error);
            throw error;
        }
    },
    async issueTokenByProjectService(req, res, next) {
        try {
            // 연결 - 에러 확인
            // 여기 코드를 미들웨어로 정리
            result = await axios({
                url: `http://localhost:5000/service/issuetoken`,
                method: 'post',
                data: {
                    serviceName: process.env.USER_SERVICE_NAME,
                    serviceType: process.env.USER_SERVICE_TYPE,
                    servicePassword: process.env.USER_SERVICE_PASSWORD,
                },
            });
            console.log(
                '프로젝트에서 생성한 토큰을 유저에서 받음 : ',
                result.data
            );
            req.projectToken = result.data;
            // res.send(result.data);
            next();
        } catch (error) {
            throw error;
        }
    },
    async verifyTokenByProjectService(req, res, next) {
        try {
            console.log('프로젝트 > 유저 토큰 보냄 : ', req.filteredToken);
            // 연결 - 에러 확인
            // 여기 코드를 미들웨어로 정리
            result = await axios({
                url: `http://localhost:5000/service/verify`,
                method: 'get',
                headers: { Authorization: req.filteredToken },
            });
            console.log('유저 > 프로젝트 토큰 보냄 결과: ', result.data);
            req.userTokenDecryptData = result.data;
            next();
            // res.send(result.data); // 주석처리
            // 여기서 result.data.message에서 토큰 만료가 뜨면 토큰 재발급 또는 리프레시토큰 보냄
        } catch (error) {
            console.log('에러 : ', error);
            throw error;
        }
    },
};
