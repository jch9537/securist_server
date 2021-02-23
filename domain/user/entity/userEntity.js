// TODO - setter, getter 따로 만들기, validation
'use strict';

module.exports = class {
    constructor({
        id,
        email,
        password,
        phone_num,
        name,
        create_at,
        user_type,
        user_state,
        login_failure_cnt,
    }) {
        this._id = id;
        this._email = email;
        // this._password = this.verifyPassword(password);
        // this._phone_num = this.verifyPhoneNum(phone_num);
        // this._name = this.verifyName(name);
        // this._create_at = this.verifyCreateAt(create_at);
        // this._user_type = this.verifyUserType(user_type);
        // this._user_state = this.verifyUserState(user_state);
        // this._login_failure_cnt = this.verifyLoginFailureCount(
        //     login_failure_cnt
        // );
    }
    get id() {
        return this._id;
    }
    // id 유효성 검사
    set id(id) {
        this._id = id + 'aaa';
    }
    // set id(id) {
    //     let reg_id = /^[a-zA-z0-9]{4,12}$/;
    //     return reg_id.test(id) ? id : null;
    // }
    get email() {
        return this._email;
    }
    // email 유효성 검사
    set email(email) {
        let reg_email = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        return email !== '' && email !== undefined && reg_email.test(email)
            ? email
            : undefined;
    }
    // verifyId(userData) {
    //     let reg_id = /^[a-zA-z0-9]{4,12}$/;
    //     return reg_id.test(userData.id) ? userData.id : undefined;
    // }
    // verifyEmail(userData) {
    //     let reg_email = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    //     return userData.email !== '' &&
    //         userData.email !== undefined &&
    //         reg_email.test(userData.email)
    //         ? userData.email
    //         : undefined;
    // }
    //     verifyPassword(userData) {
    //         let reg_pwd = /^.*(?=.{6,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
    //         return reg_pwd.test(userData.password);
    //     }
    //     verifyPhoneNum(userData) {
    //         var reg_phone = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
    //         return reg_phone.test(userData.phone_num);
    //     }
    //     verifyName(userData) {
    //         let reg_name = /^[가-힣]{2,15}$/;
    //         return reg_name.test(userData.name);
    //     }
    //     verifyCreateAt(userData) {}
    //     verifyUserType(userData) {}
    //     verifyUserState(userData) {}
    //     verifyLoginFailureCount(userData) {}
};
