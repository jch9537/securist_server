// 어드민 서비스 요청
const adminServiceUrl = process.env.ADMIN_SERVICE_URL;
const adminServiceTokenKey = process.env.ADMIN_TOKEN_KEY_USER;
const userServiceType = process.env.USER_SERVICE_TYPE;
const userServiceName = process.env.USER_SERVICE_NAME;
const userServicePassword = process.env.USER_SERVICE_PASSWORD;

const axios = require('axios');
const { getToken, setToken } = require('../database/redis');
const { ServicesError } = require('../../adapters/error');

module.exports = class AdminServer {
    constructor() {}
    // 각 메서드 별 요청 처리 함수 =============================================

    // 어드민 서비스 GET 요청
    async getRequest(url) {
        try {
            const adminServiceToken = await getToken(adminServiceTokenKey);
            console.log('저장토큰 확인 ', adminServiceToken);

            const response = await axios.get(`${adminServiceUrl}${url}`, {
                headers: { Authorization: `Bearer ${adminServiceToken}` },
            });
            console.log('응답 > adminServer > getRequest ', response.data);
            return response.data;
        } catch (error) {
            console.error('서비스 에러 응답', error.response.data);
            const err = error.response.data.error;
            if (err.message === 'jwt expired') {
                await this.requestIssueToken();
                return await this.getRequest(url);
            } else {
                throw new ServicesError('Admin', err.message, err.code);
            }
        }
    }
    // 어드민 서비스 POST 요청
    async postRequest(url, body) {
        try {
            const adminServiceToken = await getToken(adminServiceTokenKey);

            const response = await axios.post(
                `${adminServiceUrl}${url}`,
                body,
                {
                    headers: { Authorization: `Bearer ${adminServiceToken}` },
                }
            );
            console.log('응답 > adminServer > postRequest ', response.data);
            return response.data;
        } catch (error) {
            console.error('서비스 에러 응답', error.response.data);
            const err = error.response.data.error;
            if (err.message === 'jwt expired') {
                await this.requestIssueToken();
                return await this.getRequest(url);
            } else {
                throw new ServicesError('Admin', err.message, err.code);
            }
        }
    }
    // 어드민서비스 PUT 요청
    async putRequest(url, body) {
        try {
            const adminServiceToken = await getToken(adminServiceTokenKey);

            // const response = await axios.put(`${adminServiceUrl}${url}`, body); // 테스트용 - token제외 처리
            const response = await axios.post(
                `${adminServiceUrl}${url}`,
                body,
                {
                    headers: { Authorization: `Bearer ${adminServiceToken}` },
                }
            );
            console.log('응답 > adminServer > putRequest ', response.data);
            return response.data;
        } catch (error) {
            console.error('서비스 에러 응답', error.response.data);
            const err = error.response.data.error;
            if (err.message === 'jwt expired') {
                await this.requestIssueToken();
                return await this.getRequest(url);
            } else {
                throw new ServicesError('Admin', err.message, err.code);
            }
        }
    }

    // 개별 API 요청 ======================================================

    // 토큰 요청 --------------------------------------------------------
    // 어드민 서비스 토큰 발급 요청
    async requestIssueToken() {
        let url = `/services/issuetoken`;
        let userServiceData = {
            serviceType: userServiceType,
            serviceName: userServiceName,
            servicePassword: userServicePassword,
        };
        try {
            const response = await this.postRequest(url, userServiceData);
            console.log('토큰 데이터 확인 ', response);

            // redis 토큰 저장
            let storeTokenData = {
                key: adminServiceTokenKey,
                value: response.data.token,
            };
            console.log('토큰 데이터 확인 ', storeTokenData);

            await setToken(storeTokenData);

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // 관리자 ----------------------------------------------------------
    // 지역 리스트 가져오기
    async getRegion() {
        try {
            const url = `/raw/region`;
            const response = await this.getRequest(url);
            // if(userType === 3 ){
            //     DTO 추가
            // }else{
            //     //userType === 1 || userType === 2
            //     DTO 추가
            // }

            return response.data;
            // response.data = 응답.data : 데이터만 추출
        } catch (error) {
            throw error;
        }
    }
};
