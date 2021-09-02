// 유저 서비스 요청
const projectServiceUrl = process.env.PROJECT_SERVICE_URL;
const projectServiceTokenKey = process.env.PROJECT_TOKEN_KEY_USER;

const axios = require('axios');

const { GetUserDto, GetCompanyDto } = require('../../adapters/dtos');
const { getToken, setToken } = require('../database/redis');

module.exports = class ProjectService {
    constructor() {}
    // 프로젝트 서비스 GET 요청
    async getRequest(url) {
        try {
            let projectServiceToken = await getToken(projectServiceTokenKey);
            console.log('저장토큰 확인 ', projectServiceToken);

            let response = await axios.get(`${projectServiceUrl}${url}`, {
                headers: { Authorization: `Bearer ${projectServiceToken}` },
            });
            console.log(
                '응답 > 헬퍼 > userService > getRequest ',
                response.data
            );
            return response.data;
        } catch (error) {
            // console.error(error);
            throw error.response.data;
        }
    }
    // 프로젝트 서비스 POST 요청
    async postRequest(url, body) {
        try {
            let projectServiceToken = await getToken(projectServiceTokenKey);

            let response = await axios.post(
                `${projectServiceUrl}${url}`,
                body,
                {
                    headers: { Authorization: `Bearer ${projectServiceToken}` },
                }
            );
            console.log(
                '응답 > 헬퍼 > userService > postRequest ',
                response.data
            );
            return response.data;
        } catch (error) {
            // console.error(error);
            throw error.response.data;
        }
    }
    // 프로젝트 서비스 토큰 발급 요청
    async issueTokenRequest() {
        try {
            let url = `/service/issuetoken`;
            let userServiceData = {
                serviceType: process.env.USER_SERVICE_TYPE,
                serviceName: process.env.USER_SERVICE_NAME,
                servicePassword: process.env.USER_SERVICE_PASSWORD,
            };

            let response = await this.postRequest(url, userServiceData);
            console.log('토큰 데이터 확인 ', response);

            // redis 토큰 저장
            let storeTokenData = {
                key: process.env.PROJECT_TOKEN_KEY_USER,
                value: response.data.token,
            };

            await setToken(storeTokenData);

            return response.data;
        } catch (error) {
            // console.error(error);
            throw error.response.data;
        }
    }

    // 프로젝트 서비스에 프로젝트 정보 요청하기
    async getProjectInfo({ email, userType }) {
        let response;
        //수정;
        try {
            // let url = `/service/user/belonging/company/info?email=${email}&userType=${userType}`;
            // response = await this.getRequest(url);
            // // let companyInfo = new companyDTO(response);
            // // return companyInfo;
            // return response.data;
        } catch (error) {
            // console.error(error);
            if (error.errMessage === 'jwt expired') {
                await this.issueTokenRequest();
                response = await this.getUserInfo({ email, userType });
                return response;
            } else {
                throw error;
            }
        }
    }
    // 프로젝트 서비스에 사용자 소속 기업정보 요청하기
    async getCompanyInfo({ email, userType }) {
        console.log('도착-------------------');
        let response, companyInfo;
        // 수정
        try {
            let url = `/service/user/belonging/company/info?email=${email}&userType=${userType}`;
            response = await this.getRequest(url);
            console.log('응답데이터 1?', response);
            companyInfo = new GetCompanyDto(response.data);
            console.log('응답데이터 2?', companyInfo);

            return companyInfo;
        } catch (error) {
            console.error(error);
            if (error.errMessage === 'jwt expired') {
                await this.issueTokenRequest();
                response = await this.getCompanyInfo({ email, userType });
                // companyInfo = new CompanyResponseDTO(response)
                console.log('응답데이터 3?', response);
                return response;
            } else {
                console.log(error);
                throw error;
            }
        }
    }
};
