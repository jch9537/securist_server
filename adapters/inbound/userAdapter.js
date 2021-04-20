/* 
TODO : 기존 코드에서 사용자와 기업의 처리(router에서 - infra까지)를 분기하기
// 사용자와 기업은 다른 영역으로 보고 처리하기 : 코드가 복잡하고 꼬이게 됨
*/
// 메서드 정의 인터페이스 - 컨트롤러
const {
    GetUserInfo,
    UpdatePhoneNum,
    UpdateBankInfo,
    DeleteUser,
} = require('../../domain/usecase/user');

const { Repository } = require('../outbound');
const authAdapter = require('./authAdapter');

module.exports = {
    // id 토큰을 이용한 사용자 정보 - 가져오기
    async getUserInfo(token) {
        console.log(
            '요청 > adapters > inbound > userAdaptor.js > getUserInfo - userId : ',
            token
        );
        try {
            let userData = await authAdapter.getUserByIdToken(token);
            console.log(
                '응답 > adapters > inbound > userAdaptor.js > getUserByIdToken - userData : ',
                userData
            );
            let getUserInfo = new GetUserInfo(Repository);
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
    // 사용자 정보 변경 - 공통 : 연락처
    async updatePhoneNum(token, updateData) {
        console.log(
            '요청 > adapters > inbound > userAdaptor.js > updatePhoneNum - userId : ',
            token
        );
        try {
            let userData = await authAdapter.getUserByIdToken(token);
            console.log(
                '응답 > adapters > inbound > userAdaptor.js > getUserByIdToken - userData : ',
                userData
            );
            let updatePhoneNum = new UpdatePhoneNum(Repository);
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
    async updateBankInfo(token, updateData) {
        console.log(
            '요청 > adapters > inbound > userAdaptor.js > updateBankInfo - userId : ',
            token
        );
        try {
            let userData = await authAdapter.getUserByIdToken(token);
            console.log(
                '응답 > adapters > inbound > userAdaptor.js > getUserByIdToken - userData : ',
                userData
            );
            let updateBankInfo = new UpdateBankInfo(Repository);
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

    // 사용자 비밀번호 수정
    // TODO : 비밀번호 수정일 현재 시점으로 수정
    async changePassword(token, updatePasswordData) {
        console.log(
            '요청 > adapters > inbound > userAdaptor > changePassword - userParam : ',
            token,
            updatePasswordData
        );
        try {
            let result = authAdapter.changePassword(token, updatePasswordData);
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
    async deleteUser(token, deleteParams) {
        // access token으로 email과 usertype가져오기
        console.log(
            '요청 > adapters > inbound > userAdaptor > deleteUser - token : ',
            token,
            'deleteData : ',
            deleteParams
        );
        try {
            let userData = await authAdapter.getUserInfoByAccessToken(token);
            console.log(
                '응답 > adapters > inbound > userAdaptor.js > getUserInfoByAccessToken - userData : ',
                userData
            );
            let deleteData = {
                userType: userData.useType,
                password: deleteParams.password,
                withdrawalType: deleteParams.withdrawalType,
                withdrawalText: deleteParams.withdrawalText,
            };
            let deleteUser = new DeleteUser(Repository);
            let result = deleteUser.excute(token, deleteData);
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
            // deleteUser;
        }
    },
};
