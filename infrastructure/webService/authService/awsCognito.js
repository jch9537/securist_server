//TODO - userEntity를 넘겨주기 122번째 줄
//개별 클라우드 인증서비스의 실행클래스 - cognito
const AWS = require('../aws');
const { error } = require('../../exceptions');
// const { UserEntity } = require('../../../domain/user/index');
// const SES = require('../emailService/awsSes');
module.exports = class {
    constructor() {
        this.cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
    }
    findUserByEmail(email) {
        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > findUserByEmail : ',
            email
        );
        var params = {
            UserPoolId: process.env.AWS_COGNITO_USERPOOL_ID /* required */,
            AttributesToGet: [
                'email',
                // 'name',      /* more items */
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
                            '응답 > Infrastructure > webService > authService > awsCognito.js > findUserByEmail : ',
                            data
                        );
                        let userExist = data.Users.length ? true : false;
                        resolve(userExist);
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
            ClientId: process.env.AWS_APP_CLIENT_ID /* required */,
            Password: userData.password /* required */,
            Username: userData.email /* required */,
            ValidationData: [
                {
                    Name: 'email' /* required */,
                    Value: userData.email,
                },
            ],
            UserAttributes: [
                {
                    Name: 'email' /* required */,
                    Value: userData.email,
                },
                {
                    Name: 'name',
                    Value: userData.name,
                },
                {
                    Name: 'custom:retryCount', // 로그인 실패횟수
                    Value: '0',
                },
                {
                    Name: 'custom:userType',
                    Value: userData.userType,
                },
                {
                    Name: 'custom:passwordUpdatedAt', // 비밀번호변경시간
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
                // AnalyticsMetadata: {
                //     AnalyticsEndpointId: 'STRING_VALUE',
                // },
                // ClientMetadata: {
                //     '<StringType>': 'STRING_VALUE',
                //     /* '<StringType>': ... */
                // },
                // SecretHash: 'STRING_VALUE',
                // UserContextData: {
                //     EncodedData: 'STRING_VALUE',
                // },
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
                        if (err.code === 'UsernameExistsException') {
                            reject(error.userAlreadyExist(err));
                        } else if (err.code === 'InvalidPasswordException') {
                            reject(error.invalidPassword(err));
                        } else if (err.code === 'InvalidParameterException') {
                            reject(error.invalidParameter(err));
                        } else {
                            reject(err);
                        }
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
    logIn(userData) {
        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > logIn : ',
            userData
        );
        let params = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            // USER_SRP_AUTH |
            // REFRESH_TOKEN_AUTH |
            // REFRESH_TOKEN |
            // CUSTOM_AUTH |
            // ADMIN_NO_SRP_AUTH |
            // ADMIN_USER_PASSWORD_AUTH /* required */,
            ClientId: process.env.AWS_APP_CLIENT_ID /* required */,
            AuthParameters: {
                USERNAME: `${userData.email}`,
                PASSWORD: `${userData.password}`,
                /* '<StringType>': ... */
            },
            // AnalyticsMetadata: {
            //     AnalyticsEndpointId: 'STRING_VALUE',
            // },
            // ClientMetadata: {
            //     '<StringType>': 'STRING_VALUE',
            //     /* '<StringType>': ... */
            // },
            // UserContextData: {
            //     EncodedData: 'STRING_VALUE',
            // },
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.initiateAuth(
                params,
                function (err, data) {
                    if (err) {
                        // an error occurred
                        console.log(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js > logIn : ',
                            err
                        );
                        /*추가할 예외처리
                        UserNotFoundException
                        ResourceNotFoundException
                        */
                        if (err.code === 'InvalidParameterException') {
                            reject(err.invalidParameter(err));
                        } else if (err.code === 'UserNotConfirmedException') {
                            reject(error.confirmAuthMail(err));
                        } else if (err.code === 'NotAuthorizedException') {
                            if (
                                err.message ===
                                'Incorrect username or password.'
                            ) {
                                reject(error.incorrectPassword(err));
                            } else if (
                                err.message === 'Password attempts exceeded'
                                // cognito 기본 로그인 횟수제한 (5번, 이후 시도 시마다 1초~15분까지 두배로 시도 시간 증가)
                                //이 에러 발생하면 비밀번호 찾기로 이동처리
                            ) {
                                reject(error.exceededLogInCount(err));
                            } else if (err.message === 'User is disabled.') {
                                reject(error.disabledUser(err));
                            }
                        } else {
                            reject(err);
                        }
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > logIn : ',
                            data
                        );
                        resolve(data.AuthenticationResult);
                    }
                }
            );
        });
    }
    logOut(token) {
        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > logOut : '
            // token
        );
        var params = {
            AccessToken: `${token}` /* required */,
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.globalSignOut(
                params,
                function (err, data) {
                    if (err) {
                        // an error occurred
                        /*추가할 예외처리
                        ResourceNotFoundException
                        */
                        console.log(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js > logOut : ',
                            err
                        );
                        if (err.code === 'NotAuthorizedException') {
                            if (err.message === 'Access Token has expired') {
                                reject(error.accessTokenExpired(err));
                            } else if (
                                err.message === 'Access Token has been revoked'
                            ) {
                                reject(error.accessTokenExpired(err));
                            } else if (err.message === 'Invalid Access Token') {
                                reject(error.invalidAccessToken(err));
                            }
                        }
                        reject(err);
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > logOut : ',
                            data
                        );
                        resolve(data);
                    }
                }
            );
        });
    }
    getUserInfo(token) {
        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > getUserInfo : '
            // token
        );
        var params = {
            AccessToken: `${token}` /* required */,
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.getUser(
                params,
                function (err, data) {
                    if (err) {
                        // an error occurred
                        console.log(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js > getUserInfo : ',
                            err
                        );
                        reject(err);
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > getUserInfo : ',
                            data
                        );
                        resolve(data.UserAttributes);
                    }
                }
            );
        });
    }
    resetRetryCount(token) {
        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > resetLogInCount : ',
            token
        );
        var params = {
            AccessToken: `${token}` /* required */,
            UserAttributes: [
                /* required */
                {
                    Name: 'custom:retryCount' /* required */,
                    Value: '0',
                },
            ],
            // ClientMetadata: {
            //   '<StringType>': 'STRING_VALUE',
            //   /* '<StringType>': ... */
            // }
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.updateUserAttributes(
                params,
                function (err, data) {
                    // an error occurred
                    if (err) {
                        console.log(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js > resetLogInCount : ',
                            err
                        );
                        reject(err);
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > resetLogInCount : ',
                            data
                        );
                        resolve(data);
                    }
                }
            );
        });
    }

    getRetryCount(email) {
        var params = {
            UserPoolId: process.env.AWS_COGNITO_USERPOOL_ID /* required */,
            Username: `${email}` /* required */,
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.adminGetUser(
                params,
                function (err, data) {
                    if (err) {
                        // an error occurred
                        console.log(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js >  getUserInfoByAdmin : ',
                            err
                        );
                        reject(err);
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > getUserInfoByAdmin : ',
                            data
                        );
                        let count;
                        let attributes = data.UserAttributes;
                        for (let i = 0; i < attributes.length; i++) {
                            if (attributes[i].Name === 'custom:retryCount') {
                                count = Number(attributes[i].Value);
                                break;
                            }
                        }
                        resolve(count);
                    }
                }
            );
        });
    }

    setRetryCount(email, count) {
        var params = {
            UserAttributes: [
                /* required */
                {
                    Name: 'custom:retryCount' /* required */,
                    Value: `${count}`,
                },
                /* more items */
            ],
            UserPoolId: process.env.AWS_COGNITO_USERPOOL_ID /* required */,
            Username: `${email}` /* required */,
            // ClientMetadata: {
            //   '<StringType>': 'STRING_VALUE',
            //   /* '<StringType>': ... */
            // }
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.adminUpdateUserAttributes(
                params,
                function (err, data) {
                    if (err) {
                        // an error occurred
                        console.log(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js >  setRetryCount : ',
                            err
                        );
                        reject(err);
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > setRetryCount : ',
                            data
                        );
                        resolve(data);
                    }
                }
            );
        });
    }

    issueNewToken(refreshToken) {
        var params = {
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            // | REFRESH_TOKEN , /* required */
            ClientId: process.env.AWS_APP_CLIENT_ID /* required */,
            AuthParameters: {
                REFRESH_TOKEN: `${refreshToken}`,
                /* '<StringType>': ... */
            },
            // AnalyticsMetadata: {
            //   AnalyticsEndpointId: 'STRING_VALUE'
            // },
            // ClientMetadata: {
            //   '<StringType>': 'STRING_VALUE',
            //   /* '<StringType>': ... */
            // },
            // UserContextData: {
            //   EncodedData: 'STRING_VALUE'
            // }
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.initiateAuth(
                params,
                function (err, data) {
                    if (err) {
                        // an error occurred
                        console.log(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js >  issueNewToken : ',
                            err
                        );
                        reject(err);
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > issueNewToken : ',
                            data
                        );
                        resolve(data);
                    }
                }
            );
        });
    }

    //테스트 관리자코드------------------------------------------------------------
    // 관리자 회원 삭제
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
    //관리자 회원 비활성화
    disableUserByAdmin(id) {
        var params = {
            UserPoolId: process.env.AWS_COGNITO_USERPOOL_ID /* required */,
            Username: id /* required */,
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.adminDisableUser(
                params,
                function (err, data) {
                    if (err) {
                        // an error occurred
                        console.log(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js > disableUserByAdmin : ',
                            err
                        );
                        reject(err);
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > disableUserByAdmin : ',
                            data
                        );
                        resolve(data);
                    }
                }
            );
        });
    }
    //관리자 회원 활성화
    enableUserByAdmin(id) {
        var params = {
            UserPoolId: process.env.AWS_COGNITO_USERPOOL_ID /* required */,
            Username: id /* required */,
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.adminEnableUser(
                params,
                function (err, data) {
                    if (err) {
                        // an error occurred
                        console.log(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js > enableUserByAdmin : ',
                            err
                        );
                        reject(err);
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > enableUserByAdmin : ',
                            data
                        );
                        resolve(data);
                    }
                }
            );
        });
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
};
