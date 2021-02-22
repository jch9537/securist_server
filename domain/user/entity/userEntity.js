// TODO - setter, getter 따로 만들기
'use strict';

module.exports = class {
    constructor(userData) {
        this.id = userData.id;
        this.email = userData.email;
        this.password = userData.password;
        this.phone_num;
        this.name;
        this.create_at;
        this.user_type;
        this.user_state;
        this.login_failure_cnt;
    }
    // verifyReqId(id) {
    //     if (this.id) return validObj;
    // }
    // get id() {
    //     return this.id;
    // }
    // set id(userData) {
    //     // this._id = validId(userData.id)? id: 유효성검사실패처리
    // }
};
