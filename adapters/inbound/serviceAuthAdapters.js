const { serviceRepository } = require('../outbound/repository');
const { AuthorizationException } = require('../../domain/exceptions');

module.exports = {
    //--------------------------받은 요청 처리-----------------------------------
    // 각 서비스 확인 (서비스별 로그인) > 토큰 발급
    async issueToken(serviceData) {
        let result;
        try {
            result = await serviceRepository.issueToken(serviceData);
            return result;
        } catch (error) {
            throw error;
        }
    },
    // 토큰 확인
    async verifyToken(serviceData) {
        let result;
        try {
            if (
                serviceData.serviceType !== 'admin' &&
                serviceData.serviceType !== 'project'
            ) {
                throw new AuthorizationException('서비스');
            }
            result = await serviceRepository.verifyToken(serviceData);

            return result;
        } catch (error) {
            throw error;
        }
    },
    // access token이 만료되었을 때 refresh token으로 갱신 처리
    async renewToken(req, res) {},

    //-------------------------------요청보냄-----------------------------------

    async issueTokenByAdminService() {
        let result;
        try {
            let currentServiceData = {
                serviceType: process.env.USER_SERVICE_TYPE,
                serviceName: process.env.USER_SERVICE_NAME,
                servicePassword: process.env.USER_SERVICE_PASSWORD,
            };
            result = await serviceRepository.issueTokenByAdminService(
                currentServiceData
            );
            // result = await axios({
            //     url: `http://localhost:8000/service/issuetoken`,
            //     method: 'post',
            //     data: {
            //         serviceName: process.env.ADMIN_SERVICE_NAME,
            //         serviceType: process.env.ADMIN_SERVICE_TYPE,
            //         servicePassword: process.env.ADMIN_SERVICE_PASSWORD,
            //     },
            // });
            // console.log(
            //     '유저에서 생성한 토큰을 어드민에서 받음 : ',
            //     result.data
            // );
            return result;
        } catch (error) {
            throw error;
        }
    },
    async verifyTokenByAdminService() {
        let result;
        try {
            result = await serviceRepository.verifyTokenByAdminService();
            return result;
            // 토큰 전달
            // console.log('유저 토큰 확인 ', myToken);
            // result = await axios({
            //     url: `http://localhost:8000/service/verify`,
            //     method: 'get',
            //     headers: { Authorization: myToken },
            // });
            // console.log('어드민 > 유저 토큰 보냄 결과: ', result.data);
        } catch (error) {
            console.log('에러~~~~~~~~~~ : ', error);
            throw error;
        }
    },
    async issueTokenByProjectService() {
        let result;
        try {
            let currentServiceData = {
                serviceType: process.env.USER_SERVICE_TYPE,
                serviceName: process.env.USER_SERVICE_NAME,
                servicePassword: process.env.USER_SERVICE_PASSWORD,
            };
            result = await serviceRepository.issueTokenByProjectService(
                currentServiceData
            );
            return result;
            // result = await axios({
            //     url: `http://localhost:5000/service/issuetoken`,
            //     method: 'post',
            //     data: {
            //         serviceName: process.env.ADMIN_SERVICE_NAME,
            //         serviceType: process.env.ADMIN_SERVICE_TYPE,
            //         servicePassword: process.env.ADMIN_SERVICE_PASSWORD,
            //     },
            // });
            // console.log(
            //     '프로젝트에서 생성한 토큰을 어드민에서 받음 : ',
            //     result.data
            // );
        } catch (error) {
            throw error;
        }
    },
    async verifyTokenByProjectService() {
        let result;
        try {
            result = await serviceRepository.verifyTokenByProjectService();
            return result;
            // console.log('유저 토큰 확인 ', myToken);
            // result = await axios({
            //     url: `http://localhost:5000/service/verify`,
            //     method: 'get',
            //     headers: { Authorization: myToken },
            // });
            // console.log('프로젝트 > 어드민 토큰 보냄 결과 : ', result.data);
            // return result.data;
        } catch (error) {
            console.log('에러~~~~~~~~~~ : ', error.response.data);
            // if (error.response.data.name === 'TokenExpiredError') {
            //     //// 여기서 어떻게 해야하나???
            //     console.log('여기서 어떻게 해야하나???');
            // } else {
            //     next(error);
            // }
            throw error;
        }
    },
};
