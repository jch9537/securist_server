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
            console.log('요청보낸 url', `${adminServiceUrl}/service${url}`);
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
            console.log(adminServiceToken);
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
                return await this.postRequest(url, body);
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

    // 인증-과제 연결 정보 ===========================================

    // 선택 인증 별 모든 연결 정보 가져오기
    async getLinkedAllInfoByCertification(certificationData) {
        try {
            const url = `/settings/link/all?certificationId=${certificationData.certificationId}`;
            const response = await this.getRequest(url);

            return response.data;
            // response.data = 응답.data : 데이터만 추출
        } catch (error) {
            throw error;
        }
    }
    // 선택 인증들의 과제 리스트 가져오기
    async getLinkedTasksInfo(certificationData) {
        try {
            let queryString = '';
            if (Array.isArray(certificationData.certificationId)) {
                // 선택 인증이 여러개인 경우
                const certificationId = certificationData.certificationId;
                certificationId.forEach((certificationId, index) => {
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
            let url = `/settings/link/tasks${queryString}`;
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
    // 시험 -----------------------
    // 시험 종류 리스트 가져오기
    async getExamTimeList(examData, userData) {
        try {
            const { examType, examDate } = examData;
            const url = `/exam/times?examType=${examType}&examDate=${examDate}`;
            console.log('exam ==========', url);
            const response = await this.getRequest(url);
            return response;
        } catch (error) {
            throw error;
        }
    }
    async getExamDateList(examData, userData) {
        try {
            const url = `/exam/dates?examType=${examData.examType}`;
            console.log('exam ==========', url);
            const response = await this.getRequest(url);
            return response;
        } catch (error) {
            throw error;
        }
    }
    //issuance ------------------
    async createLicenseIssuance(issuanceData) {
        try {
            const url = `/exam/issuance`;
            console.log('exam/issuance ==========', url);
            const response = await this.postRequest(url, issuanceData);
            return response;
        } catch (error) {
            throw error;
        }
    }
    async getLicenseIssuanceByUser(issuanceData) {
        try {
            const url = `/exam/issuance?examReceptionId=${issuanceData.examReceptionId}`;
            console.log(
                `exam/issuance?examReceptionId=${issuanceData.examReceptionId} ==========`,
                url
            );
            const response = await this.getRequest(url);
            return response;
        } catch (error) {
            throw error;
        }
    }
    async getLicenseIssuanceListByReceptionId(issuanceData) {
        try {
            const url = `/exam/issuance/${issuanceData.licenseIssuanceId}`;
            console.log(
                `exam/issuance/${issuanceData.licenseIssuanceId} ==========`,
                url
            );
            const response = await this.getRequest(url);
            return response;
        } catch (error) {
            throw error;
        }
    }
    async cancelLicenseIssuanceByUser(issuanceData) {
        try {
            const url = `/exam/issuance/${issuanceData.licenseIssuanceId}/cancel`;
            console.log(
                `/exam/issuance/${issuanceData.licenseIssuanceId}/cancel`,
                url
            );
            const response = await this.putRequest(url, issuanceData);
            return response;
        } catch (error) {
            throw error;
        }
    }
    async updateLicenseIssuanceByUser(issuanceData) {
        try {
            const url = `/exam/issuance/${issuanceData.licenseIssuanceId}`;
            console.log(
                `/exam/issuance/${issuanceData.licenseIssuanceId}`,
                url
            );
            const response = await this.putRequest(url, issuanceData);
            return response;
        } catch (error) {
            throw error;
        }
    }
    //reception ------------------
    async createExamReception(receptionData) {
        try {
            const url = `/exam/receptions`;
            console.log(`/exam/receptions`, url);
            const response = await this.postRequest(url, receptionData);
            return response;
        } catch (error) {
            throw error;
        }
    }
    async updateMyEmail(receptionData) {
        try {
            const url = `/exam/receptions/my/email`;
            console.log(`/exam/receptions/my/email`, url);
            const response = await this.putRequest(url, receptionData);
            return response;
        } catch (error) {
            throw error;
        }
    }
    async getReceptionList(receptionData) {
        try {
            const url = `/exam/receptions/my?pageType=${receptionData.pageType}`;
            console.log(
                `/exam/receptions/my?pageType=${receptionData.pageType}`,
                url
            );
            const response = await this.getRequest(url);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async cancelExamReception(receptionData) {
        try {
            const url = `/exam/receptions/cancel`;
            console.log(`/exam/receptions/cancel`, url);
            const response = await this.putRequest(url, receptionData);
            return response;
        } catch (error) {
            throw error;
        }
    }
    async getExamReception(receptionData) {
        try {
            const url = `/exam/receptions/my/${receptionData.examReceptionId}`;
            console.log(
                `/exam/receptions/my/${receptionData.examReceptionId}`,
                url
            );
            const response = await this.getRequest(url);
            return response;
        } catch (error) {
            console.log('adminserver', error);
            throw error;
        }
    }
};
