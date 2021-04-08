'use strict';
const UserEntity = require('./UserEntity');
const { ParameterException } = require('../../exceptions');

module.exports = class extends UserEntity {
    constructor({ email, name, userType, phoneNum, createdAt, profileState }) {
        super(email);
        this.name = name;
        this.userType = userType;
        this.phoneNum = phoneNum;
        this.createdAt = createdAt;
        this.profileState = profileState;
    }
    // name
    get name() {
        return this._name;
    }
    set name(name) {
        let regName = /^[a-zA-Z가-힣]{2,50}$/; // 이름 유효성 체크 : 한글, 영문 50자 이내

        if (!regName.test(name)) {
            throw new ParameterException('이름');
        } else {
            this._name = name;
        }
    }
    // userType
    get userType() {
        return this._userType;
    }
    set userType(userType) {
        let regUserType = /^[123]$/; // 사용자 타입 유효성 체크 : 1, 2, 3 만 사용

        if (!regUserType.test(userType)) {
            throw new ParameterException('사용자 타입');
        } else {
            this._userType = userType;
        }
    }
    // phoneNum
    get phoneNum() {
        return this._phoneNum;
    }
    set phoneNum(phoneNum) {
        let regPhoneNum = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
        //특수문자 / 문자 / 숫자 포함 형태의 8~20자리 이내의 암호 정규식

        if (!regPhoneNum.test(phoneNum)) {
            throw new ParameterException('연락처');
        } else {
            this._phoneNum = phoneNum;
        }
    }
    // createdAt
    get createdAt() {
        return this._createdAt;
    }
    set createdAt(createdAt) {
        this._createdAt = createdAt;
    }
    // profileState
    get profileState() {
        return this._profileState;
    }
    set profileState(profileState) {
        console.log(profileState);
        let regProfileState = /^[0123]$/;
        // 프로필 상태 - 0: 미작성, 1: 인증 중, 2: 인증완료 계좌등록 전, 3: 인증/계좌등록 완료
        if (!regProfileState.test(profileState)) {
            throw new ParameterException('profileState');
        } else {
            this._profileState = profileState;
        }
    }
};
