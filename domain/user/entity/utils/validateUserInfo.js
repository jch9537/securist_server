module.exports = {
    validateId(id) {
        let reg_id = /^[a-zA-z0-9]{4,12}$/;
        return reg_id.test(id);
    },
    validateEmail(email) {
        let reg_email = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/; // 유효성 체크 확인
        return email !== '' && email !== undefined && reg_email.test(email);
    },
    validatePassword(password) {
        let reg_pwd = /^.*(?=.{6,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
        return reg_pwd.test(password);
    },
    validateName(name) {
        let reg_name = /^[가-힣]{2,15}$/;
        return reg_name.test(name);
    },
    validatePhoneNum(phone_num) {
        let reg_phone = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
        return reg_phone.test(phone_num);
    },
    validateUserType(user_type) {
        let reg_user_type = /^[12]$/;
        return reg_user_type.test(user_type);
    },
    validateUserState(user_state) {
        let reg_user_state = /^[12]$/;
        return reg_user_state.test(user_state);
    },
    validateLogInFailure(login_failure_cnt) {
        let reg_login_failure_cnt = /^[01234]$/;
        return (
            login_failure_cnt < 5 &&
            login_failure_cnt >= 0 &&
            reg_login_failure_cnt.test(login_failure_cnt)
        );
    },
};
