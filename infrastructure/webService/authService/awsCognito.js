//개별 클라우드 인증서비스의 실행클래스 - cognito
const AWS = require('../aws');
module.exports = class {
    constructor() {
        this.cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
    }
    // 사용자 회원 가입
    signup(userData) {
        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > signup : '
        );
        let params = {
            ClientId: process.env.AWS_APP_CLIENT_ID /* required */,
            Password: userData.password /* required */,
            Username: userData.id /* required */,
            // AnalyticsMetadata: {
            //     AnalyticsEndpointId: 'STRING_VALUE',
            // },
            // ClientMetadata: {
            //     '<StringType>': 'STRING_VALUE',
            //     /* '<StringType>': ... */
            // },
            // SecretHash: 'STRING_VALUE',
            UserAttributes: [
                {
                    Name: 'email' /* required */,
                    Value: userData.email,
                },
                /* more items */
            ],
            // UserContextData: {
            //     EncodedData: 'STRING_VALUE',
            // },
            ValidationData: [
                {
                    Name: 'email' /* required */,
                    Value: userData.email,
                },
                /* more items */
            ],
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.signUp(
                params,
                function (err, data) {
                    if (err) {
                        console.log(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js > signup : ',
                            err
                        );
                        reject(err);
                    } else {
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > signup : ',
                            data
                        );
                        resolve(data);
                    }
                }
            );
        });
    }
    //관리자 회원 가입
    createUser(userData) {
        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > createUser : '
        );
        // return 'Cognito Success';
        let params = {
            UserPoolId: process.env.AWS_COGNITO_USERPOOL_ID /* required */,
            Username: userData.id /* required */,
            // ClientMetadata: {
            //     '<StringType>': 'STRING_VALUE',
            //     /* '<StringType>': ... */
            // },
            DesiredDeliveryMediums: [
                'EMAIL',
                /* more items */
            ],
            ForceAliasCreation: false, // email/phone_num 별칭 사용여부에 따른 처리설정 true: 기존사용자의 별칭이 새로운 사용자의 별칭으로 수정, false : AliasExistsException 오류발생
            MessageAction: 'SUPPRESS', // "RESEND" : 이미 존재하는 사용자에게 메일발송, SUPPRESS : 메일전송 안함
            // TemporaryPassword: 'STRING_VALUE', // 임시지정 비밀번호
            UserAttributes: [
                {
                    Name: 'email' /* required */,
                    Value: userData.email,
                } /* 필수 속성의 name-value 객체들*/,
            ],
            // ValidationData: [
            //     {
            //         Name: 'STRING_VALUE' /* required */,
            //         Value: 'STRING_VALUE',
            //     },
            //     /* more items */
            // ],
            // 사용자지정 유효성검사 속성
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.adminCreateUser(
                params,
                function (err, data) {
                    if (err) {
                        // console.log(
                        //     '에러 응답 > Infrastructure > webService > authService > awsCognito.js > createUser : ',
                        //     err
                        // );
                        reject(err);
                    }
                    // an error occurred
                    else {
                        // console.log(
                        //     '응답 > Infrastructure > webService > authService > awsCognito.js > createUser : ',
                        //     data
                        // );
                        resolve(data);
                    }
                }
            );
        });
    }
    getUser() {
        console.log(
            'Infrastructure > webService > authService > awsCognito.js - getUser!! : '
        );
        return 'Cognito Success : getUser';
    }

    // email로 cognito에서 사용자 가져오기(중복확인)
    getEmail(email) {
        let params = {
            UserPoolId: process.env.AWS_COGNITO_USERPOOL_ID /* required */,
            AttributesToGet: [
                'email',
                /* ('STRING_VALUE') : 검색 결과 사용자의 반환될 속성 이름(문자열)의 배열, 배열이 null이면 모든 속성 반환 */
            ],
            Filter: `email=\"${email}\"`, //('STRING_VALUE'), 속성명 필터타입 = 속성값
            // Limit: // ('NUMBER_VALUE')반환할 최대 사용자 수
            // PaginationToken: (STRING_VALUE) 이전 호출에서 반환될 식별자. 목록의 다음 아이템 세트에 반환될..
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.listUsers(
                params,
                function (err, data) {
                    if (err) return reject(err);
                    else return resolve(data);
                }
            );
        });
    }
    deleteUserByAdmin(id) {
        let params = {
            UserPoolId: process.env.AWS_COGNITO_USERPOOL_ID /* required */,
            Username: id /* required */,
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.adminDeleteUser(
                params,
                function (err, data) {
                    if (err) {
                        console.log(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js > delteUserByAdmin : ',
                            err
                        );
                        reject(err);
                    } else {
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > delteUserByAdmin : ',
                            data
                        );
                        resolve(data);
                    }
                }
            );
        });
    }
};
