// 'use strict';

// const { AuthEntity } = require('../(delete)auth');
// const { ParameterException } = require('../../exceptions');
// /*
// type의 경우 위와 같이 형식을 나눠주는 것이 코드 가독성이 좋음
// const UpdateBankInfoEntityConfig = {
//     userType: {
//         PERSONAL_CONSULTANT : '1',
//     }
// }
// */
// module.exports = class extends AuthEntity {
//     constructor({
//         email,
//         userType,
//         bankName,
//         bankAccountNum,
//         bankAccountOwner,
//     }) {
//         super(email);
//         this.userType = userType;
//         this.bankName = bankName;
//         this.bankAccountNum = bankAccountNum;
//         this.bankAccountOwner = bankAccountOwner;
//     }
//     // userType
//     get userType() {
//         return this._userType;
//     }
//     set userType(userType) {
//         let regUserType = /^[123]$/; // 사용자 타입 유효성 체크 : 1, 2, 3 만 사용

//         if (!regUserType.test(userType)) {
//             throw new ParameterException('사용자 타입');
//         } else {
//             this._userType = userType;
//         }
//     }
//     // bankName
//     get bankName() {
//         return this._bankName;
//     }
//     set bankName(bankName) {
//         let regBankName = /^[a-zA-Z가-힣]{2,50}$/; // 은행명 유효성 체크 : 한글, 영문 50자 이내

//         if (!regBankName.test(bankName)) {
//             throw new ParameterException('은행명');
//         } else {
//             this._bankName = bankName;
//         }
//     }
//     // bankAccountNum
//     get bankAccountNum() {
//         return this._bankAccountNum;
//     }
//     set bankAccountNum(bankAccountNum) {
//         let regBankAccountNum = /^[0-9]{2,30}$/; // 계좌번호 유효성 체크 : 수정해야함!!!!!!!!!!!!!

//         if (!regBankAccountNum.test(bankAccountNum)) {
//             throw new ParameterException('계좌번호');
//         } else {
//             this._bankAccountNum = bankAccountNum;
//         }
//     }
//     // bankAccountOwner
//     get bankAccountOwner() {
//         return this._bankAccountOwner;
//     }
//     set bankAccountOwner(bankAccountOwner) {
//         let regBankAccountOwner = /^[a-zA-Z가-힣]{2,50}$/; // 계좌주 유효성 체크 : 한글, 영문 50자 이내

//         if (!regBankAccountOwner.test(bankAccountOwner)) {
//             throw new ParameterException('계좌주');
//         } else {
//             this._bankAccountOwner = bankAccountOwner;
//         }
//     }
// };
