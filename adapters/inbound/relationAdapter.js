/* 
TODO : 기존 코드에서 사용자와 기업의 처리(router에서 - infra까지)를 분기하기
// 사용자와 기업은 다른 영역으로 보고 처리하기 : 코드가 복잡하고 꼬이게 됨
*/
// 메서드 정의 인터페이스 - 컨트롤러
const {
    CreateUserAndCompanyRelation,
    GetRelationInfo,
    UpdatePermitBelongingStatus,
    DeleteUserAndCompanyRelation,
} = require('../../domain/usecase/relation');
const userAdapter = require('./userAdapter');
const { Repository } = require('../outbound');
// const {
//     checkExpiredPassword,
// } = require('../../infrastructure/webService/authService/awsMiddleware');

module.exports = {
    // 사용자-기업 연결 정보 생성
    async createUserAndCompanyRelation(joinData) {
        console.log(
            '요청 > adapters > inbound > relationAdapter > createUserAndCompanyRelation - joinData : ',
            joinData
        );
        try {
            let createUserAndCompanyRelation = new CreateUserAndCompanyRelation(
                Repository
            );
            let result = await createUserAndCompanyRelation.excute(joinData);
            console.log(
                '응답 > adapters > inbound > relationAdapter > createUserAndCompanyRelation - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > relationAdapter > createUserAndCompanyRelation - err : ',
                err
            );
            throw err;
        }
    },
    // 사용자-기업 연결정보 가져오기
    async getRelationInfo(userData) {
        console.log(
            '요청 > adapters > inbound > userAdaptor > getRelationInfo - userData : ',
            userData
        );
        try {
            let getRelationInfo = new GetRelationInfo(Repository);
            let result = await getRelationInfo.excute(userData);
            console.log(
                '응답 > adapters > inbound > userAdaptor > getRelationInfo - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > userAdaptor > getRelationInfo - err : ',
                err
            );
            throw err;
        }
    },
    // 기업 - 사용자 소속요청 승인처리
    async updatePermitBelongingStatus(userData, selectUserId) {
        console.log(
            '요청 > adapters > inbound > userAdaptor > updatePermitBelongingStatus - userId : ',
            userData,
            selectUserId
        );
        try {
            if (userData.userType === '3') {
                companyIdColumn = 'client_company_id';
            } else if (userData.userType === '2') {
                companyIdColumn = 'consulting_company_id';
            }

            let companyInfo = await userAdapter.getUserBelongingCompanyInfo(
                userData
            );
            let companyId = companyInfo[companyIdColumn];
            let updateData = {
                userType: userData.userType,
                email: selectUserId,
                companyId: companyId,
            };

            let updatePermitBelongingStatus = new UpdatePermitBelongingStatus(
                Repository
            );
            let result = await updatePermitBelongingStatus.excute(updateData);
            console.log(
                '응답 > adapters > inbound > userAdaptor > updatePermitBelongingStatus- result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 > adapters > inbound > userAdaptor > updatePermitBelongingStatus- error : ',
                err
            );
            throw err;
        }
    },

    // 사용자 - 사용자-기업연결 삭제
    async deleteRelationByUser(deleteData) {
        console.log(
            '요청 > adapters > inbound > relationAdapter > deleteUserAndCompanyRelation - deleteData : ',
            deleteData
        );
        try {
            let deleteUserAndCompanyRelation = new DeleteUserAndCompanyRelation(
                Repository
            );
            let result = await deleteUserAndCompanyRelation.excute(deleteData);
            console.log(
                '응답 > adapters > inbound > relationAdapter > deleteUserAndCompanyRelation - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > relationAdapter > deleteUserAndCompanyRelation - err : ',
                err
            );
            throw err;
        }
    },
    // 업체 - 사용자-기업연결 삭제
    async deleteRelationByCompany(userData, selectUserId) {
        let companyIdColumn;
        console.log(
            '요청 > adapters > inbound > relationAdapter > deleteUserAndCompanyRelation - userData, selectUserId : ',
            userData,
            selectUserId
        );
        try {
            if (userData.userType === '3') {
                companyIdColumn = 'client_company_id';
            } else if (userData.userType === '2') {
                companyIdColumn = 'consulting_company_id';
            }

            let companyInfo = await userAdapter.getUserBelongingCompanyInfo(
                userData
            );
            let companyId = companyInfo[companyIdColumn];
            let deleteData = {
                userType: userData.userType,
                email: selectUserId,
                companyId: companyId,
            };

            let deleteUserAndCompanyRelation = new DeleteUserAndCompanyRelation(
                Repository
            );
            let result = await deleteUserAndCompanyRelation.excute(deleteData);
            console.log(
                '응답 > adapters > inbound > relationAdapter > deleteUserAndCompanyRelation - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > relationAdapter > deleteUserAndCompanyRelation - err : ',
                err
            );
            throw err;
        }
    },
};
