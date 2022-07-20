const exec = require('child_process').exec; // child_process 모듈 추가

function GetValue(plaindata, key) {
    let arrData = plaindata.split(':');
    let value = '';
    for (i in arrData) {
        let item = arrData[i];
        if (item.indexOf(key) == 0) {
            let valLen = parseInt(item.replace(key, ''));
            arrData[i++];
            value = arrData[i].substr(0, valLen);
            break;
        }
    }
    return value;
}

module.exports = class NiceModule {
    constructor() {
        this.sSiteCode = process.env.NICE_SITE_CODE;
        this.sSitePW = process.env.NICE_SITE_PW;
        this.sModulePath = process.env.NICE_MODULE_PATH;
        this.sAuthType = '';
        this.sPopGubun = 'N';
        this.sCustomize = '';
        this.sGender = '';
        this.sReturnUrl = `${process.env.NICE_RESPONSE_IP}/api/user/auth/nice/success`;
        this.sErrorUrl = `${process.env.NICE_RESPONSE_IP}/api/user/auth/nice/fail`;
    }

    async success(encodeData) {
        console.log('성공 > encodeData : ', encodeData);
        let result;
        let sEncData = encodeData;
        let cmd = '';

        return new Promise((resolve, reject) => {
            if (/^0-9a-zA-Z+\/=/.test(sEncData) == true) {
                sRtnMSG = '입력값 오류';
                requestnumber = '';
                authtype = '';
                errcode = '';
                result = { sRtnMSG, requestnumber, authtype, errcode };
                reject(result);
            } else {
                if (sEncData != '') {
                    cmd =
                        this.sModulePath +
                        ' ' +
                        'DEC' +
                        ' ' +
                        this.sSiteCode +
                        ' ' +
                        this.sSitePW +
                        ' ' +
                        sEncData;
                }

                let sDecData = '';
                let child = exec(cmd, { encoding: 'euc-kr' });
                child.stdout.on('data', function (data) {
                    sDecData += data;
                });
                child.on('close', function () {
                    console.log(sDecData);

                    //처리 결과 메시지
                    let sRtnMSG = '';
                    //처리 결과 확인
                    if (sDecData == '-1') {
                        sRtnMSG = '암/복호화 시스템 오류';
                        result = { sDecData, sRtnMSG };
                    } else if (sDecData == '-4') {
                        sRtnMSG = '복호화 처리 오류';
                        result = { sDecData, sRtnMSG };
                    } else if (sDecData == '-5') {
                        sRtnMSG = 'HASH값 불일치 - 복호화 데이터는 리턴됨';
                        result = { sDecData, sRtnMSG };
                    } else if (sDecData == '-6') {
                        sRtnMSG = '복호화 데이터 오류';
                        result = { sDecData, sRtnMSG };
                    } else if (sDecData == '-9') {
                        sRtnMSG = '입력값 오류';
                        result = { sDecData, sRtnMSG };
                    } else if (sDecData == '-12') {
                        sRtnMSG = '사이트 비밀번호 오류';
                        result = { sDecData, sRtnMSG };
                    } else {
                        //항목의 설명은 개발 가이드를 참조
                        let requestnumber = decodeURIComponent(
                            GetValue(sDecData, 'REQ_SEQ')
                        ); //CP요청 번호 , main에서 생성한 값을 되돌려준다. 세션등에서 비교 가능
                        let responsenumber = decodeURIComponent(
                            GetValue(sDecData, 'RES_SEQ')
                        ); //고유 번호 , 나이스에서 생성한 값을 되돌려준다.
                        let authtype = decodeURIComponent(
                            GetValue(sDecData, 'AUTH_TYPE')
                        ); //인증수단
                        let name = decodeURIComponent(
                            GetValue(sDecData, 'UTF8_NAME')
                        ); //이름
                        let birthdate = decodeURIComponent(
                            GetValue(sDecData, 'BIRTHDATE')
                        ); //생년월일(YYYYMMDD)
                        let gender = decodeURIComponent(
                            GetValue(sDecData, 'GENDER')
                        ); //성별
                        let nationalinfo = decodeURIComponent(
                            GetValue(sDecData, 'NATIONALINFO')
                        ); //내.외국인정보
                        let dupinfo = decodeURIComponent(
                            GetValue(sDecData, 'DI')
                        ); //중복가입값(64byte)
                        let conninfo = decodeURIComponent(
                            GetValue(sDecData, 'CI')
                        ); //연계정보 확인값(88byte)
                        let mobileno = decodeURIComponent(
                            GetValue(sDecData, 'MOBILE_NO')
                        ); //휴대폰번호(계약된 경우)
                        let mobileco = decodeURIComponent(
                            GetValue(sDecData, 'MOBILE_CO')
                        ); //통신사(계약된 경우)
                        result = {
                            sRtnMSG,
                            requestnumber,
                            responsenumber,
                            authtype,
                            name,
                            birthdate,
                            gender,
                            nationalinfo,
                            dupinfo,
                            conninfo,
                            mobileno,
                            mobileco,
                        };
                    }
                    console.log('nice 성공결과 : ', result);

                    if (Number(sDecData) < 0) {
                        reject(result);
                    } else {
                        resolve(result);
                    }
                });
            }
        });
    }
    async fail(encodeData) {
        // console.log('실패 > encodeData : ', encodeData)
        let result;
        let sEncData = encodeData;
        let cmd = '';

        return new Promise((resolve, reject) => {
            if (/^0-9a-zA-Z+\/=/.test(sEncData) == true) {
                sRtnMSG = '입력값 오류';
                requestnumber = '';
                authtype = '';
                errcode = '';

                result = {
                    sRtnMSG,
                    requestnumber,
                    authtype,
                    errcode,
                };
                reject(result);
            } else {
                if (sEncData != '') {
                    cmd =
                        this.sModulePath +
                        ' ' +
                        'DEC' +
                        ' ' +
                        this.sSiteCode +
                        ' ' +
                        this.sSitePW +
                        ' ' +
                        sEncData;
                }

                let sDecData = '';
                let child = exec(cmd, { encoding: 'euc-kr' });
                child.stdout.on('data', function (data) {
                    sDecData += data;
                });
                child.on('close', function () {
                    console.log(sDecData);

                    //처리 결과 메시지
                    let sRtnMSG = '';
                    //처리 결과 확인
                    if (sDecData == '-1') {
                        sRtnMSG = '암/복호화 시스템 오류';
                        result = { sDecData, sRtnMSG };
                    } else if (sDecData == '-4') {
                        sRtnMSG = '복호화 처리 오류';
                        result = { sDecData, sRtnMSG };
                    } else if (sDecData == '-5') {
                        sRtnMSG = 'HASH값 불일치 - 복호화 데이터는 리턴됨';
                        result = { sDecData, sRtnMSG };
                    } else if (sDecData == '-6') {
                        sRtnMSG = '복호화 데이터 오류';
                        result = { sDecData, sRtnMSG };
                    } else if (sDecData == '-9') {
                        sRtnMSG = '입력값 오류';
                        result = { sDecData, sRtnMSG };
                    } else if (sDecData == '-12') {
                        sRtnMSG = '사이트 비밀번호 오류';
                        result = { sDecData, sRtnMSG };
                    } else {
                        //항목의 설명은 개발 가이드를 참조
                        let requestnumber = decodeURIComponent(
                            GetValue(sDecData, 'REQ_SEQ')
                        ); //CP요청 번호 , main에서 생성한 값을 되돌려준다. 세션등에서 비교 가능
                        let authtype = decodeURIComponent(
                            GetValue(sDecData, 'AUTH_TYPE')
                        ); //인증수단
                        let errcode = decodeURIComponent(
                            GetValue(sDecData, 'ERR_CODE')
                        ); //본인인증 실패 코드
                        result = {
                            sRtnMSG,
                            requestnumber,
                            authtype,
                            errcode,
                        };
                    }
                    console.log('인증오류 : ', result);
                    if (Number(sDecData) < 0) {
                        reject(result);
                    } else {
                        resolve(result);
                    }
                });
            }
        });
    }

    async main() {
        //업체 요청 번호
        //세션등에 저장하여 데이터 위변조 검사 (인증후에 다시 전달)
        let d = new Date();
        let sCPRequest = this.sSiteCode + '_' + d.getTime();

        //전달 원문 데이터 초기화
        let sPlaincData = '';
        //전달 암호화 데이터 초기화
        let sEncData = '';
        //처리 결과 메시지
        let sRtnMSG = '';

        sPlaincData =
            '7:REQ_SEQ' +
            sCPRequest.length +
            ':' +
            sCPRequest +
            '8:SITECODE' +
            this.sSiteCode.length +
            ':' +
            this.sSiteCode +
            '9:AUTH_TYPE' +
            this.sAuthType.length +
            ':' +
            this.sAuthType +
            '7:RTN_URL' +
            this.sReturnUrl.length +
            ':' +
            this.sReturnUrl +
            '7:ERR_URL' +
            this.sErrorUrl.length +
            ':' +
            this.sErrorUrl +
            '11:POPUP_GUBUN' +
            this.sPopGubun.length +
            ':' +
            this.sPopGubun +
            '9:CUSTOMIZE' +
            this.sCustomize.length +
            ':' +
            this.sCustomize +
            '6:GENDER' +
            this.sGender.length +
            ':' +
            this.sGender;
        console.log('[' + sPlaincData + ']');

        let cmd =
            this.sModulePath +
            ' ' +
            'ENC' +
            ' ' +
            this.sSiteCode +
            ' ' +
            this.sSitePW +
            ' ' +
            sPlaincData;
        return new Promise((resolve, reject) => {
            let child = exec(cmd, { encoding: 'euc-kr' });

            child.stdout.on('data', function (data) {
                // console.log('~~~~~~~~~~~~~~~~', data);
                sEncData += data;
            });
            child.on('close', function () {
                // console.log('-----------------97번째 줄', sEncData);
                //처리 결과 확인
                if (sEncData == '-1') {
                    sRtnMSG = '암/복호화 시스템 오류입니다.';
                } else if (sEncData == '-2') {
                    sRtnMSG = '암호화 처리 오류입니다.';
                } else if (sEncData == '-3') {
                    sRtnMSG = '암호화 데이터 오류 입니다.';
                } else if (sEncData == '-9') {
                    sRtnMSG =
                        '입력값 오류 : 암호화 처리시, 필요한 파라미터 값을 확인해 주시기 바랍니다.';
                } else {
                    sRtnMSG = '';
                }
                console.log('데이터 확인 sEncData : ', { sEncData, sRtnMSG });
                // response.render('checkplus_main.ejs', { sEncData, sRtnMSG });
                let result = { sEncData, sRtnMSG };
                console.log('모듈 시작 성공 : ', result);
                if (Number(sEncData) < 0) {
                    reject(result);
                } else {
                    resolve(result);
                }
            });
        });
    }

    async successPost(encodeData) {
        let result = await this.success(encodeData);
        console.log('성공 > POST > result : ', result);
        return result;
    }
    //chrome80 이상 대응
    async successGet(encodeData) {
        let result = await this.success(encodeData);
        console.log('성공 > GET > result : ', result);
        return result;
    }
    // 실패처리는 테스트 못함
    async failPost(encodeData) {
        let result = await this.fail(encodeData);
        console.log('실패 > POST > result : ', result);
        return result;
    }
    //chrome80 대응
    async failGet(encodeData) {
        let result = await this.fail(encodeData);
        console.log('실패 > GET > result : ', result);
        return result;
    }
};
