// 프로젝트 서버 요청
const projectServiceUrl = process.env.PROJECT_SERVICE_URL;
const projectServiceTokenKey = process.env.PROJECT_TOKEN_KEY_USER;
const userServiceType = process.env.USER_SERVICE_TYPE;
const userServiceName = process.env.USER_SERVICE_NAME;
const userServicePassword = process.env.USER_SERVICE_PASSWORD;

const axios = require('axios');
const { getToken, setToken } = require('../database/redis');
const { ServicesError } = require('../../adapters/error');
module.exports = class ProjectServer {
    constructor() {}
    // 프로젝트 서비스 GET 요청
    async getRequest(url) {
        try {
            const projectServiceToken = await getToken(projectServiceTokenKey);
            console.log('저장토큰 확인 ', projectServiceToken);

            const response = await axios.get(
                `${projectServiceUrl}/service${url}`,
                {
                    headers: { Authorization: `Bearer ${projectServiceToken}` },
                }
            );
            console.log('응답 > ProjectServer > getRequest ', response.data);
            return response.data;
        } catch (error) {
            console.error('서비스 에러 응답', error);
            const err = error.response.data.error;
            if (err.message === 'Token expired' || err.message === 'No token') {
                await this.requestIssueToken();
                return await this.getRequest(url);
            } else {
                throw new ServicesError('Project', err.message, err.code);
            }
        }
    }
    // 프로젝트 서비스 POST 요청
    async postRequest(url, body) {
        try {
            const projectServiceToken = await getToken(projectServiceTokenKey);

            const response = await axios.post(
                `${projectServiceUrl}/service${url}`,
                body,
                {
                    headers: { Authorization: `Bearer ${projectServiceToken}` },
                }
            );
            console.log('응답 > ProjectServer > postRequest ', response.data);

            return response.data;
        } catch (error) {
            console.error('서비스 에러 응답', error);
            const err = error.response.data.error;
            if (err.message === 'Token expired' || err.message === 'No token') {
                await this.requestIssueToken();
                return await this.postRequest(url, body);
            } else {
                throw new ServicesError('Project', err.message, err.code);
            }
        }
    }
    // 프로젝트 서버 PUT 요청
    async putRequest(url, body) {
        try {
            const projectServiceToken = await getToken(projectServiceTokenKey);
            console.log('저장토큰 확인 ', projectServiceToken);

            // const response = await axios.put(`${ProjectServiceUrl}${url}`, body); // 테스트용 - token제외 처리
            const response = await axios.put(
                `${projectServiceUrl}/service${url}`,
                body,
                {
                    headers: { Authorization: `Bearer ${projectServiceToken}` },
                }
            );
            console.log('응답 > ProjectServer > putRequest ', response.data);
            return response.data;
        } catch (error) {
            console.error('서비스 에러 응답', error);
            const err = error.response.data.error;
            if (err.message === 'Token expired' || err.message === 'No token') {
                await this.requestIssueToken();
                return await this.putRequest(url, body);
            } else {
                throw new ServicesError('Project', err.message, err.code);
            }
        }
    }

    // 개별 API 요청 ======================================================

    // 토큰 요청 --------------------------------------------------------
    // 프로젝트 서비스 토큰 발급 요청
    async requestIssueToken() {
        try {
            const url = `/issuetoken`;
            const userServiceData = {
                serviceType: userServiceType,
                serviceName: userServiceName,
                servicePassword: userServicePassword,
            };

            const response = await this.postRequest(url, userServiceData);
            console.log('토큰 데이터 확인 ', response);

            // redis 토큰 저장
            const storeTokenData = {
                key: projectServiceTokenKey,
                value: response.data.token,
            };
            console.log('토큰 데이터 확인 ', storeTokenData);

            await setToken(storeTokenData);

            return response.data;
        } catch (error) {
            throw error;
        }
    }
    // 프로젝트 ----------------------------------------------------------
    // 프로젝트 견적 계산 요청
    async estimateProject(projectData) {
        try {
            const url = `/projects/estimate`;
            const response = await this.postRequest(url, projectData);

            return response.data;
        } catch (error) {
            throw error;
        }
    }
    // 프로젝트 견적 계산 요청
    async estimateProject(projectData) {
        try {
            const url = `/projects/estimate`;
            const response = await this.postRequest(url, projectData);

            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async createProject(projectData) {
        try {
            const url = `/projects`;
            const response = await this.postRequest(url, projectData);

            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
