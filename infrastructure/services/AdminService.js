// 어드민 서비스 요청
const adminServiceUrl = process.env.ADMIN_SERVICE_URL;
const adminServiceTokenKey = process.env.ADMIN_TOKEN_KEY_PROJECT;

const axios = require('axios');
const { getToken, setToken } = require('../../infrastructure/database/redis');

module.exports = class AdminService {
    constructor() {}

    // 어드민 서비스 GET 요청
    async getRequest(url) {
        try {
            let adminServiceToken = await getToken(adminServiceTokenKey);

            let response = await axios.get(`${adminServiceUrl}${url}`, {
                headers: { Authorization: `Bearer ${adminServiceToken}` },
            });
            console.log(
                '응답 > 헬퍼 > userserviceRequest > getRequest ',
                response.data
            );
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
    // 어드민 서비스 POST 요청
    async postRequest(url, body) {
        try {
            let adminServiceToken = await getToken(adminServiceTokenKey);

            let response = await axios.post(`${adminServiceUrl}${url}`, body, {
                headers: { Authorization: `Bearer ${adminServiceToken}` },
            });
            console.log(
                '응답 > 헬퍼 > userserviceRequest > postRequest ',
                response.data
            );
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }

    // 어드민 서비스 토큰 발급 요청
    async issueTokenRequest() {
        let url = `/service/issuetoken`;
        let userServiceData = {
            serviceType: process.env.USER_SERVICE_TYPE,
            serviceName: process.env.USER_SERVICE_NAME,
            servicePassword: process.env.USER_SERVICE_PASSWORD,
        };
        try {
            let response = await this.postRequest(url, userServiceData);
            console.log('토큰 데이터 확인 ', response);

            // redis 토큰 저장
            let storeTokenData = {
                key: process.env.ADMIN_TOKEN_KEY_USER,
                value: response.data.token,
            };
            console.log('토큰 데이터 확인 ', storeTokenData);

            await setToken(storeTokenData);

            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response.data;
        }
    }
};
