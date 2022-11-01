const { service } = require('../../outbound');
const { ParameterException } = require('../../../domain/exceptions');
const {
    CreateExamReception,
    UpdateMyEmail,
    CancelExamReception,
    GetReceptionList,
    GetExamReception,
} = require('../../../domain/usecase/exam/receptions');

module.exports = class ExamReceptionsAdapter {
    constructor(userService) {
        this.userService = userService;
    }
    //===========================접수============================================

    //------------------------- 수험자 --------------------------------
    // 시험 접수 정보 생성하기
    async createExamReception(receptionData, uploadFiles) {
        try {
            const createExamReception = new CreateExamReception(service);
            const result = await createExamReception.excute(
                receptionData,
                uploadFiles
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 사용자 이메일 수정
    async updateMyEmail(receptionData) {
        try {
            const updateMyEmail = new UpdateMyEmail(service);
            const result = await updateMyEmail.excute(receptionData);
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 사용자 정보 접수 정보 리스트 가져오기
    async getReceptionList(receptionData) {
        try {
            const { pageType } = receptionData;
            if (pageType !== 'before' && pageType !== 'after')
                throw new ParameterException('Invalid page type'); // 파라미터 오류

            const getReceptionList = new GetReceptionList(service);
            const result = await getReceptionList.excute(receptionData);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // 접수 취소(접수 타입 수정)하기 : 사용자
    async cancelExamReception(receptionData) {
        try {
            const cancelExamReception = new CancelExamReception(service);
            const result = await cancelExamReception.excute(receptionData);
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 개별 접수 정보 가져오기 : 권한 확인할때도 있고 확인하지 않을때도 있음
    async getExamReception(receptionData, userData) {
        try {
            const getExamReception = new GetExamReception(service);
            const result = await getExamReception.excute(
                receptionData,
                userData
            );

            if (result && result.refundAccountNum) {
                result.refundAccountNum = crypto.decrypt(
                    result.refundAccountNum
                );
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
};
