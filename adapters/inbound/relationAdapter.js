/* 
TODO : 기존 코드에서 사용자와 기업의 처리(router에서 - infra까지)를 분기하기
// 사용자와 기업은 다른 영역으로 보고 처리하기 : 코드가 복잡하고 꼬이게 됨
*/
// 메서드 정의 인터페이스 - 컨트롤러
const {
    CreateUserAndCompanyRelation,
    GetRelationInfo,
    UpdateBelongingStatus,
    // DeleteUserAndCompanyRelation,
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
    // 기업-사용자 소속상태 변경 처리 : 기업, 사용자 공통
    async updateBelongingStatus(userData, updateParam) {
        let result, updateData;
        console.log(
            '요청 > adapters > inbound > userAdaptor > updateBelongingStatus - userId : ',
            userData,
            updateParam
        );
        try {
            userData.userType = '1'; //테스트용
            if (userData.userType === '1') {
                updateData = {
                    userType: userData.userType,
                    companyId: updateParam.companyId,
                    email: userData.email,
                    // email: 'mg.sun@aegisecu.com', //테스트용
                    status: updateParam.updateStatus,
                };
            } else {
                if (userData.userType === '3') {
                    companyIdColumn = 'client_company_id';
                } else if (userData.userType === '2') {
                    companyIdColumn = 'consulting_company_id';
                }

                let companyInfo = await userAdapter.getUserBelongingCompanyInfo(
                    userData
                );
                let companyId = companyInfo[companyIdColumn];
                updateData = {
                    userType: userData.userType,
                    companyId: companyId,
                    email: updateParam.selectUserId,
                    status: updateParam.updateStatus,
                };
            }
            console.log(
                updateData,
                '------------------------업데이트 유저데이터'
            );

            let updateBelongingStatus = new UpdateBelongingStatus(Repository);
            result = await updateBelongingStatus.excute(updateData);
            console.log(
                '응답 > adapters > inbound > userAdaptor > updateBelongingStatus- result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 > adapters > inbound > userAdaptor > updateBelongingStatus- error : ',
                err
            );
            throw err;
        }
    },

    // // 사용자 - 사용자-기업연결 삭제
    // async deleteRelationByUser(deleteData) {
    //     console.log(
    //         '요청 > adapters > inbound > relationAdapter > deleteUserAndCompanyRelation - deleteData : ',
    //         deleteData
    //     );
    //     try {
    //         let deleteUserAndCompanyRelation = new DeleteUserAndCompanyRelation(
    //             Repository
    //         );
    //         let result = await deleteUserAndCompanyRelation.excute(deleteData);
    //         console.log(
    //             '응답 > adapters > inbound > relationAdapter > deleteUserAndCompanyRelation - result : ',
    //             result
    //         );
    //         return result;
    //     } catch (err) {
    //         console.log(
    //             '에러 응답 > adapters > inbound > relationAdapter > deleteUserAndCompanyRelation - err : ',
    //             err
    //         );
    //         throw err;
    //     }
    // },
    // // 업체 - 사용자-기업연결 삭제
    // async deleteRelationByCompany(userData, selectUserId) {
    //     let companyIdColumn;
    //     console.log(
    //         '요청 > adapters > inbound > relationAdapter > deleteUserAndCompanyRelation - userData, selectUserId : ',
    //         userData,
    //         selectUserId
    //     );
    //     try {
    //         if (userData.userType === '3') {
    //             companyIdColumn = 'client_company_id';
    //         } else if (userData.userType === '2') {
    //             companyIdColumn = 'consulting_company_id';
    //         }

    //         let companyInfo = await userAdapter.getUserBelongingCompanyInfo(
    //             userData
    //         );
    //         let companyId = companyInfo[companyIdColumn];
    //         let deleteData = {
    //             userType: userData.userType,
    //             email: selectUserId,
    //             companyId: companyId,
    //         };

    //         let deleteUserAndCompanyRelation = new DeleteUserAndCompanyRelation(
    //             Repository
    //         );
    //         let result = await deleteUserAndCompanyRelation.excute(deleteData);
    //         console.log(
    //             '응답 > adapters > inbound > relationAdapter > deleteUserAndCompanyRelation - result : ',
    //             result
    //         );
    //         return result;
    //     } catch (err) {
    //         console.log(
    //             '에러 응답 > adapters > inbound > relationAdapter > deleteUserAndCompanyRelation - err : ',
    //             err
    //         );
    //         throw err;
    //     }
    // },
};
