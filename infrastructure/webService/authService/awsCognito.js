//TODO - userEntity를 넘겨주기 122번째 줄
//개별 클라우드 인증서비스의 실행클래스 - cognito
const AWS = require('../aws');
const { UserEntity } = require('../../../domain/user/index');
const SES = require('../emailService/awsSes');
module.exports = class {
    constructor() {
        this.cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
    }
    checkDuplicateEmail(email) {
        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > checkDuplicateEmail : ',
            email
        );
        var params = {
            UserPoolId: 'ap-northeast-2_5MrwZlTbH' /* required */,
            AttributesToGet: [
                'email',
                // 'name',
                /* more items */
            ],
            Filter: `email = "${email}"`,
            // Limit: 1,
            // PaginationToken: 'STRING_VALUE',
        };
        let result = new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.listUsers(
                params,
                function (err, data) {
                    if (err) {
                        console.log(err, err.stack);
                        reject(err);
                    }
                    // an error occurred
                    else {
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > checkDuplicateEmail : ',
                            data
                        );
                        let duplicatedUser = data.Users.length ? true : false;
                        resolve(duplicatedUser);
                    } // successful response
                }
            );
        });
        return result;
    }
    // 사용자 회원 가입
    signUp(userData) {
        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > signup : ',
            userData
        );
        let params = {
            ClientId: '3r8dg08q6smfehvs10ckl7c227' /* required */,
            // ClientId: process.env.AWS_APP_CLIENT_ID /* required */,
            Password: userData.password /* required */,
            Username: userData.email /* required */,
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
                {
                    Name: 'name' /* required */,
                    Value: userData.name,
                },
                {
                    Name: 'custom:logInFailCount' /* required */, // 로그인 실패횟수
                    Value: '0',
                },
                {
                    Name: 'custom:userType' /* required */,
                    Value: userData.userType,
                },
                {
                    Name: 'custom:passwordUpdatedAt' /* required */, // 비밀번호변경시간
                    Value: `${new Date()}`,
                },
                // 아래 세개의 경우 계정이 존재하면 기본적으로 cognito 응답 Users배열 내
                // Enabled / UserCreateDate / UserLastModifiedDate가 있어서 필요없음
                // {
                //     Name: 'custom:login_lock_state' /* required */, // 로그인 잠금상태
                //     Value: false,
                // },
                // {
                //     Name: 'updated at' /* required */, // 정보변경시간
                //     Value: new Date(),
                // },
                // {
                //     Name: 'custom:created_at' /* required */, // 회원가입날짜시간(변경불가)
                //     Value: new Date(),
                // },

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
        let result = new Promise((resolve, reject) => {
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
        return result;
    }
    // //관리자 회원 가입
    // async createUser(userData) {
    //     console.log(
    //         '요청 > Infrastructure > webService > authService > awsCognito.js > createUser : '
    //     );
    //     // return 'Cognito Success';
    //     let params = {
    //         UserPoolId: process.env.AWS_COGNITO_USERPOOL_ID /* required */,
    //         Username: userData.id /* required */,
    //         // ClientMetadata: {
    //         //     '<StringType>': 'STRING_VALUE',
    //         //     /* '<StringType>': ... */
    //         // },
    //         DesiredDeliveryMediums: [
    //             'EMAIL',
    //             /* more items */
    //         ],
    //         ForceAliasCreation: false, // email/phone_num 별칭 사용여부에 따른 처리설정 true: 기존사용자의 별칭이 새로운 사용자의 별칭으로 수정, false : AliasExistsException 오류발생
    //         MessageAction: 'SUPPRESS', // "RESEND" : 이미 존재하는 사용자에게 메일발송, SUPPRESS : 메일전송 안함
    //         // TemporaryPassword: 'STRING_VALUE', // 임시지정 비밀번호
    //         UserAttributes: [
    //             {
    //                 Name: 'email' /* required */,
    //                 Value: userData.email,
    //             } /* 필수 속성의 name-value 객체들*/,
    //         ],
    //         // ValidationData: [
    //         //     {
    //         //         Name: 'STRING_VALUE' /* required */,
    //         //         Value: 'STRING_VALUE',
    //         //     },
    //         //     /* more items */
    //         // ],
    //         // 사용자지정 유효성검사 속성
    //     };
    //     let cognitoUser = new Promise((resolve, reject) => {
    //         this.cognitoidentityserviceprovider.adminCreateUser(
    //             params,
    //             function (err, data) {
    //                 if (err) {
    //                     console.log(
    //                         '에러 응답 > Infrastructure > webService > authService > awsCognito.js > createUser : ',
    //                         err
    //                     );
    //                     reject(err);
    //                 }
    //                 // an error occurred
    //                 else {
    //                     console.log(
    //                         '응답 > Infrastructure > webService > authService > awsCognito.js > createUser : ',
    //                         data
    //                     );
    //                     resolve(data);
    //                 }
    //             }
    //         );
    //     });
    //     let responseUserData = await cognitoUser;
    //     let userResData = {
    //         id: responseUserData.User.Username,
    //     };
    //     let userEntity = new UserEntity(userResData);
    //     return userEntity;
    // }
    // getUser() {
    //     console.log(
    //         'Infrastructure > webService > authService > awsCognito.js - getUser!! : '
    //     );
    //     return 'Cognito Success : getUser';
    // }

    // // email로 cognito에서 사용자 가져오기(중복확인)
    // getEmail(email) {
    //     let params = {
    //         UserPoolId: process.env.AWS_COGNITO_USERPOOL_ID /* required */,
    //         AttributesToGet: [
    //             'email',
    //             /* ('STRING_VALUE') : 검색 결과 사용자의 반환될 속성 이름(문자열)의 배열, 배열이 null이면 모든 속성 반환 */
    //         ],
    //         Filter: `email=\"${email}\"`, //('STRING_VALUE'), 속성명 필터타입 = 속성값
    //         // Limit: // ('NUMBER_VALUE')반환할 최대 사용자 수
    //         // PaginationToken: (STRING_VALUE) 이전 호출에서 반환될 식별자. 목록의 다음 아이템 세트에 반환될..
    //     };
    //     return new Promise((resolve, reject) => {
    //         this.cognitoidentityserviceprovider.listUsers(
    //             params,
    //             function (err, data) {
    //                 if (err) return reject(err);
    //                 else return resolve(data);
    //             }
    //         );
    //     });
    // }
    deleteUserByAdmin(id) {
        let params = {
            UserPoolId: 'ap-northeast-2_5MrwZlTbH' /* required */,
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
