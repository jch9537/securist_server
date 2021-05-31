/* 
TODO : 기존 코드에서 사용자와 기업의 처리(router에서 - infra까지)를 분기하기
// 사용자와 기업은 다른 영역으로 보고 처리하기 : 코드가 복잡하고 꼬이게 됨
*/
// 메서드 정의 인터페이스 - 컨트롤러
const {
    GetUserInfo,
    GetUserBelongingCompanyInfo,
    UpdatePhoneNum,
    UpdateBankInfo,
    DeleteUser,
} = require('../../domain/usecase/user');

const { repository } = require('../outbound');
const authAdapter = require('./authAdapter');

module.exports = {
    // 사용자 DB 정보 가져오기
    async getUserInfo(userData) {
        console.log(
            '요청 > adapters > inbound > userAdaptor.js > getUserInfo - userId : ',
            userData
        );
        try {
            let getUserInfo = new GetUserInfo(repository);
            let result = await getUserInfo.excute(userData);
            console.log(
                '응답 > adapters > inbound > userAdaptor.js > getUserInfo - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > userAdaptor.js > getUserInfo - err : ',
                err
            );
            throw err;
        }
    },
    // 사용자 소속기업 정보 가져오기
    async getUserBelongingCompanyInfo(userData) {
        console.log(
            '요청 > adapters > inbound > userAdaptor > getUserBelongingInfo - userData : ',
            userData
        );
        try {
            let getUserBelongingCompanyInfo = new GetUserBelongingCompanyInfo(
                repository
            );
            let result = await getUserBelongingCompanyInfo.excute(userData);
            console.log(
                '응답 > adapters > inbound > userAdaptor > getUserBelongingInfo - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > userAdaptor > getUserBelongingInfo - err : ',
                err
            );
            throw err;
        }
    },
    // 사용자 비밀번호 수정
    async changePassword(token, updatePasswordData) {
        console.log(
            '요청 > adapters > inbound > userAdaptor > changePassword - userParam : ',
            token,
            updatePasswordData
        );
        try {
            let result = await authAdapter.changePassword(
                token,
                updatePasswordData
            );
            console.log(
                '응답 > adapters > inbound > userAdaptor > changePassword - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > userAdaptor > changePassword - result : ',
                err
            );
            throw err;
        }
    },
    // 사용자 정보 변경 - 공통 : 연락처
    async updatePhoneNum(userData, updateData) {
        console.log(
            '요청 > adapters > inbound > userAdaptor.js > updatePhoneNum - userId : ',
            userData,
            updateData
        );
        try {
            let updatePhoneNum = new UpdatePhoneNum(repository);
            let result = await updatePhoneNum.excute(userData, updateData);
            console.log(
                '응답 > adapters > inbound > userAdaptor.js > updatePhoneNum - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > userAdaptor.js > updatePhoneNum - err : ',
                err
            );
            throw err;
        }
    },
    // 사용자 정보 변경 - 컨설턴트 공통 : 입금정보
    async updateBankInfo(userData, updateData) {
        console.log(
            '요청 > adapters > inbound > userAdaptor.js > updateBankInfo - userId : ',
            userData,
            updateData
        );
        try {
            let updateBankInfo = new UpdateBankInfo(repository);
            let result = await updateBankInfo.excute(userData, updateData);
            console.log(
                '응답 > adapters > inbound > userAdaptor.js > updateBankInfo - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > userAdaptor.js > updateBankInfo - err : ',
                err
            );
            throw err;
        }
    },
    // 회원탈퇴
    async deleteUser(accessToken, deleteData) {
        // 기업삭제를 할꺼면 email과 userType을 가져와야하고 / 사용자만 삭제할 꺼면 현재대로 처리해도 됨
        console.log(
            '요청 > adapters > inbound > userAdaptor > deleteUser - token : ',
            accessToken,
            'deleteData : ',
            deleteData
        );
        try {
            let verifyUserData = await authAdapter.verifyUserByPassword(
                accessToken,
                deleteData
            );
            console.log(
                '응답 > adapters > inbound > userAdaptor.js > getUserInfoByAccessToken - userData : ',
                verifyUserData
            );
            let newToken = verifyUserData.AccessToken;

            let userData = await authAdapter.getUserInfoByAccessToken(
                accessToken
            );
            console.log(
                '응답 > adapters > inbound > userAdaptor.js > getUserInfoByAccessToken - userData : ',
                userData
            );
            let withdrawalData = {
                email: userData.email,
                userType: userData.userType,
                withdrawalType: deleteData.withdrawalType,
            };
            let deleteUser = new DeleteUser(repository);
            let result = await deleteUser.excute(newToken, withdrawalData);
            console.log(
                '응답 > adapters > inbound > userAdaptor > deleteUser - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > userAdaptor > deleteUser - result : ',
                err
            );
            throw err;
        }
    },
};
