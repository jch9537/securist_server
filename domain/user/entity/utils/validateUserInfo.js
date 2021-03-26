module.exports = {
    //common
    validateCreatedAt() {},
    validateDeletedAt() {},
    // userEntityValidation
    validateId(id) {
        let regId = /^[a-zA-z0-9]{4,12}$/;
        return regId.test(id);
    },
    validateEmail(email) {
        let regmail = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/; // 유효성 체크 확인
        return email !== '' && email !== undefined && regmail.test(email);
    },
    validatePassword(password) {
        let regPwd = /^.*(?=.{6,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
        return regPwd.test(password);
    },
    validateName(name) {
        let reg_name = /^[가-힣]{2,15}$/;
        return reg_name.test(name);
    },
    validatePhoneNum(phoneNum) {
        let regPhone = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
        return regPhone.test(phoneNum);
    },
    validateUserType(userType) {
        let regUserType = /^[12]$/;
        return regUserType.test(userType);
    },
    validateUserState(userState) {
        let regUserState = /^[12]$/;
        return regUserState.test(userState);
    },
    validateLogInFailCount(logInFailCount) {
        let regLogInFailCount = /^[01234]$/;
        return (
            logInFailCount < 5 &&
            logInFailCount >= 0 &&
            regLogInFailCount.test(logInFailCount)
        );
    },
};
