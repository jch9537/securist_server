// 어드민 서버 요청
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

            const response = await axios.get(
                `${adminServiceUrl}/service${url}`,
                {
                    headers: { Authorization: `Bearer ${adminServiceToken}` },
                }
            );
            console.log('응답 > adminServer > getRequest ', response.data);
            return response.data;
        } catch (error) {
            console.error('서비스 에러 응답', error.response.data);
            const err = error.response.data.error;
            if (err.message === 'Token expired' || err.message === 'No token') {
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
                `${adminServiceUrl}/service${url}`,
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
            if (err.message === 'Token expired' || err.message === 'No token') {
                await this.requestIssueToken();
                return await this.posttRequest(url, body);
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
            const response = await axios.put(
                `${adminServiceUrl}/service${url}`,
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
            if (err.message === 'Token expired' || err.message === 'No token') {
                await this.requestIssueToken();
                return await this.putRequest(url, body);
            } else {
                throw new ServicesError('Admin', err.message, err.code);
            }
        }
    }

    // 개별 API 요청 ======================================================

    // 토큰 요청 --------------------------------------------------------
    // 어드민 서비스 토큰 발급 요청
    async requestIssueToken() {
        const url = `/issuetoken`;
        const userServiceData = {
            serviceType: userServiceType,
            serviceName: userServiceName,
            servicePassword: userServicePassword,
        };
        try {
            const response = await this.postRequest(url, userServiceData);
            console.log('토큰 데이터 확인 ', response);

            // redis 토큰 저장
            const storeTokenData = {
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

    // 기본(원시) 정보 =================================
    // 지역 리스트 가져오기
    async getRegion() {
        try {
            const url = `/info/region`;
            const response = await this.getRequest(url);

            return response.data;
            // response.data = 응답.data : 데이터만 추출
        } catch (error) {
            throw error;
        }
    }
    // 선택 지역의 세부 지역 리스트 가져오기
    async getArea(regionData) {
        try {
            const regionId = regionData.regionId;
            const queryString = `?regionId=${regionId}`;
            const url = `/info/area${queryString}`;
            const response = await this.getRequest(url);

            return response.data;
            // response.data = 응답.data : 데이터만 추출
        } catch (error) {
            throw error;
        }
    }
    // 업종 리스트 가져오기
    async getIndustries() {
        try {
            const url = `/info/industries`;
            const response = await this.getRequest(url);

            return response.data;
            // response.data = 응답.data : 데이터만 추출
        } catch (error) {
            throw error;
        }
    }

    // 인증 ===========================================
    // 게시 완료된 인증 리스트 조회하기
    async getCompleteCertifications() {
        try {
            const url = `/settings/certifications`;
            const response = await this.getRequest(url);

            return response.data;
            // response.data = 응답.data : 데이터만 추출
        } catch (error) {
            throw error;
        }
    }
    // 선택 인증의 모든 연결 정보 가져오기
    async getCertificationConnectedInfo(certificationData) {
        try {
            const url = `/settings/certifications/${certificationData.certificationId}`;
            const response = await this.getRequest(url);

            return response.data;
            // response.data = 응답.data : 데이터만 추출
        } catch (error) {
            throw error;
        }
    }
    // 과제 ===========================================
    // 선택 인증들의 과제 리스트 가져오기
    async getTasksByCertifications(certificationData) {
        try {
            let queryString = '';
            if (Array.isArray(certificationData.certificationId)) {
                // 선택 인증이 여러개인 경우
                const certificationIds = certificationData.certificationId;
                certificationIds.forEach((certificationId, index) => {
                    if (index === 0) {
                        queryString += `?certificationId=${certificationId}`;
                    } else {
                        queryString += `&certificationId=${certificationId}`;
                    }
                });
            } else {
                // 선택인증이 하나인 경우
                const certificationId = certificationData.certificationId;
                queryString += `?certificationId=${certificationId}`;
            }
            let url = `/settings/tasks${queryString}`;
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

    // 게시판 =============================================
    // 공지사항 ------------------------
    // 게시된 공지사항 리스트 가져오기
    async getPostingAnnouncementBoards(announcementBoardData) {
        try {
            const { postingState } = announcementBoardData;
            const url = `/boards/announcement?postingState=${postingState}`;
            const response = await this.getRequest(url);

            return response.data;
            // response.data = 응답.data : 데이터만 추출
        } catch (error) {
            throw error;
        }
    }
    // 개별 공지사항 글 가져오기
    async getAnnouncementBoard(announcementBoardData) {
        try {
            const url = `/boards/announcement/${announcementBoardData.announcementBoardId}`;
            console.log('announcement   ========= ', url);
            const response = await this.getRequest(url);

            return response.data;
            // response.data = 응답.data : 데이터만 추출
        } catch (error) {
            throw error;
        }
    }
    // 교육 게시판 ------------------------
    // 게시된 교육 게시판 리스트 가져오기
    async getPostingEducationBoards(educationBoardData) {
        try {
            const { postingState } = educationBoardData;
            const url = `/boards/education?postingState=${postingState}`;
            const response = await this.getRequest(url);

            return response.data;
            // response.data = 응답.data : 데이터만 추출
        } catch (error) {
            throw error;
        }
    }
    // 개별 교육 게시판 글 가져오기
    async getEducationBoard(educationBoardData) {
        try {
            const url = `/boards/education/${educationBoardData.educationBoardId}`;
            console.log('education   ========= ', url);
            const response = await this.getRequest(url);

            return response.data;
            // response.data = 응답.data : 데이터만 추출
        } catch (error) {
            throw error;
        }
    }
};
