const { service } = require('../outbound');
const {
    GetRegion,
    GetArea,
    GetIndustries,
} = require('../../domain/usecase/info');
module.exports = class InfoAdapter {
    constructor() {}

    // 기본 지역 정보 가져오기
    async getRegion() {
        try {
            let getRegion = new GetRegion(service);
            let result = await getRegion.excute();
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 기본 세부지역 정보 가져오기
    async getArea(regionData) {
        try {
            let getArea = new GetArea(service);
            let result = await getArea.excute(regionData);
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 업종 리스트 가져오기
    async getIndustries() {
        try {
            let getIndustries = new GetIndustries(service);
            let result = await getIndustries.excute();
            return result;
        } catch (error) {
            throw error;
        }
    }
};
