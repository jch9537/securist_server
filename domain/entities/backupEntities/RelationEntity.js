'use strict';

const { ParameterException } = require('../exceptions');
// /*
// type의 경우 위와 같이 형식을 나눠주는 것이 코드 가독성이 좋음
// const UpdateBankInfoEntityConfig = {
//     userType: {
//         PERSONAL_CONSULTANT : 1,
//     }
// }
// */

// 추후 헬퍼함수 모듈로 변경
const idReg = /^[0-9]+$/;
const stateReg = /^[0-1]$/;
const examTypeReg = /^[12]$/; // 시험 타입 유효성 체크 : 1, 2 만 사용
const nameReg = /^[a-zA-Z가-힣]{0,20}$/;
const nameAndNumReg = /^[0-9a-zA-Z가-힣]{0,20}$/;
const NameAndSpecialStringReg = /^[0-9a-zA-Z가-힣!@#$%^&=_\+\-\(\)]+$/;
// const NameAndSpecialStringReg = /^[\w\W]{0,20}$/;
const passwordReg = /^.*(?=^.{8,20}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
//특수문자 / 문자 / 숫자 포함 형태의 8~20자리 이내의 암호 정규식
const textReg = /[^<>]+$/;
const dateReg = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;
// const dateReg = /^([0-9]{4})[-/]?([0-9]{2})[-/]?([0-9]{2})$/;
// ex. 20210725, 2021-07-25, 2021/07/25 등
const timeReg = /^([0-2]{1})([0-9]{1}):?([0-5]{1})([0-9]{1})$/;
const phoneNumReg = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
//특수문자 / 문자 / 숫자 포함 형태의 8~20자리 이내의 암호 정규식
const emailReg = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/; // 유효성 체크 확인 : 영문, 숫자, 사용 가능한 특수문자(@.-_)외 입력, 30자 이하 체크!!
module.exports = class RelationEntity {
    constructor({ email = null, companyId = null, belongingType = null }) {
        this.email = email;
        this.companyId = companyId;
        this.belongingType = belongingType;
    }
    // email
    get email() {
        return this._email;
    }
    set email(email) {
        if (email !== null) {
            if (
                !(email !== '' && email !== undefined && emailReg.test(email))
            ) {
                console.log('----------------------------', email);
                throw new ParameterException('이메일');
            } else {
                this._email = email;
            }
        } else {
            this._email = email;
        }
    }
    // companyId
    get companyId() {
        return this._companyId;
    }
    set companyId(companyId) {
        if (companyId !== null) {
            if (!idReg.test(companyId)) {
                throw new ParameterException('기업 아이디');
            } else {
                this._companyId = Number(companyId);
            }
        } else {
            this._companyId = Number(companyId);
        }
    }
    // belongingType
    get belongingType() {
        return this._belongingType;
    }
    set belongingType(belongingType) {
        if (belongingType !== null) {
            let belongingTypeReg = /^[012]$/; // 소속상태 타입 유효성 체크 : 0, 1, 2 만 사용

            if (!belongingTypeReg.test(belongingType)) {
                throw new ParameterException('사용자 타입');
            } else {
                this._belongingType = Number(belongingType);
            }
        } else {
            this._belongingType = Number(belongingType);
        }
    }
};
