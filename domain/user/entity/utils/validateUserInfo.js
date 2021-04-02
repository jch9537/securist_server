// // userEntityValidation
// module.exports = {
//     // validateId(id) {
//     //     let regId = /^[a-zA-z0-9]{4,12}$/;
//     //     return regId.test(id);
//     // },
//     validateEmail(email) {
//         console.log('~~~~~~~~~~~~~~~~~~~~~~~~~');
//         let regEmail = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/; // 유효성 체크 확인
//         return email !== '' && email !== undefined && regEmail.test(email);
//     },
//     validatePassword(password) {
//         let regPwd = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
//         //특수문자 / 문자 / 숫자 포함 형태의 8~15자리 이내의 암호 정규식
//         return regPwd.test(password);
//     },
//     validateName(name) {
//         let regName = /^[가-힣]{2,15}$/;
//         return regName.test(name);
//     },
//     validatePhoneNum(phoneNum) {
//         let regPhone = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
//         return regPhone.test(phoneNum);
//     },
//     validateUserType(userType) {
//         let regUserType = /^[123]$/;
//         return regUserType.test(userType);
//     },
// };
