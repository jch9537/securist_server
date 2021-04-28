/* 
TODO : 기존 코드에서 사용자와 기업의 처리(router에서 - infra까지)를 분기하기
// 사용자와 기업은 다른 영역으로 보고 처리하기 : 코드가 복잡하고 꼬이게 됨
*/
// 메서드 정의 인터페이스 - 컨트롤러
const {
    CreateUserAndCompanyRelation,
    GetRelationInfo,
    DeleteUserAndCompanyRelation,
} = require('../../domain/usecase/relation');

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

    // 사용자 - 사용자-기업연결 삭제
    async deleteRelationByUser(releaseData) {
        console.log(
            '요청 > adapters > inbound > relationAdapter > deleteUserAndCompanyRelation - releaseData : ',
            releaseData
        );
        try {
            let deleteUserAndCompanyRelation = new DeleteUserAndCompanyRelation(
                Repository
            );
            let result = await deleteUserAndCompanyRelation.excute(releaseData);
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
    async deleteRelationByCompany(userData, userId) {
        console.log(
            '요청 > adapters > inbound > relationAdapter > deleteUserAndCompanyRelation - userData, userId : ',
            userData,
            userId
        );
        try {
            // 사용자 기업정보가져오기 - !!!!!!!!!!!!!!!!!!
            let deleteUserAndCompanyRelation = new DeleteUserAndCompanyRelation(
                Repository
            );
            let result = await deleteUserAndCompanyRelation.excute(
                userData,
                userId
            );
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
