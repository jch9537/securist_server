/* 
TODO : 기존 코드에서 사용자와 기업의 처리(router에서 - infra까지)를 분기하기
*/
// 메서드 정의 인터페이스 - 컨트롤러
const {
    CreateUserAndCompanyRelation,
    GetRelationInfo,
    UpdateBelongingStatus,
} = require('../../domain/usecase/relation');
const userAdapter = require('./userAdapter');
const { repository } = require('../outbound');

module.exports = {
    // 사용자-기업 연결정보 가져오기
    async getRelationInfo(userData) {
        console.log(
            '요청 > adapters > inbound > userAdaptor > getRelationInfo - userData : ',
            userData
        );
        try {
            let getRelationInfo = new GetRelationInfo(repository);
            let result = await getRelationInfo.excute(userData);
            console.log(
                '응답 > adapters > inbound > userAdaptor > getRelationInfo - result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '에러 응답 > adapters > inbound > userAdaptor > getRelationInfo - error : ',
                error
            );
            throw error;
        }
    },
    // 사용자-기업 연결 정보 생성
    async createUserAndCompanyRelation(userData, companyData) {
        console.log(
            '요청 > adapters > inbound > relationAdapter > createUserAndCompanyRelation - companyData : ',
            userData,
            companyData
        );
        try {
            let createUserAndCompanyRelation = new CreateUserAndCompanyRelation(
                repository
            );
            let result = await createUserAndCompanyRelation.excute(
                userData,
                companyData
            );
            console.log(
                '응답 > adapters > inbound > relationAdapter > createUserAndCompanyRelation - result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '에러 응답 > adapters > inbound > relationAdapter > createUserAndCompanyRelation - error : ',
                error
            );
            throw error;
        }
    },
    // 기업-사용자 소속상태 변경 처리 : 기업, 사용자 공통
    async updateBelongingStatus(userData, updateData) {
        let result, updateStatusData, companyIdColumn;
        console.log(
            '요청 > adapters > inbound > userAdaptor > updateBelongingStatus - userId : ',
            userData,
            updateData
        );
        try {
            // userData.userType = 1; //테스트용
            if (userData.userType === 1) {
                updateStatusData = {
                    userType: userData.userType,
                    companyId: updateData.companyId,
                    email: userData.email,
                    // email: 'mg.sun@aegisecu.com', //테스트용
                    belongingType: updateData.belongingType,
                };
            } else {
                if (userData.userType === 3) {
                    companyIdColumn = 'client_company_id';
                } else if (userData.userType === 2) {
                    companyIdColumn = 'consulting_company_id';
                }

                let companyInfo = await userAdapter.getUserBelongingCompanyInfo(
                    userData
                );
                let companyId = companyInfo[companyIdColumn];

                updateStatusData = {
                    userType: userData.userType,
                    companyId: companyId,
                    email: updateData.userId,
                    belongingType: updateData.belongingType,
                };
            }

            let updateBelongingStatus = new UpdateBelongingStatus(repository);
            result = await updateBelongingStatus.excute(
                userData,
                updateStatusData
            );
            console.log(
                '응답 > adapters > inbound > userAdaptor > updateBelongingStatus- result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '에러 > adapters > inbound > userAdaptor > updateBelongingStatus- erroror : ',
                error
            );
            throw error;
        }
    },
};
