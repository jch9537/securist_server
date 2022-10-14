const { service } = require('../../outbound');
const {
    GetExamDateList,
    GetExamTimeList,
} = require('../../../domain/usecase/exam');
module.exports = class ExamInfoAdapter {
    constructor() {}

    // 시험 종류별 시험 날짜 정보 가져오기 : 사용자
    async getExamDateList(examData, userData) {
        try {
            const getExamDateList = new GetExamDateList(service);
            const result = await getExamDateList.excute(examData, userData);
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 시험 종류/시험 날짜별 시험 시간 정보 가져오기
    async getExamTimeList(examData, userData) {
        try {
            const getExamTimeList = new GetExamTimeList(service);
            const result = await getExamTimeList.excute(examData, userData);
            return result;
        } catch (error) {
            throw error;
        }
    }
};
