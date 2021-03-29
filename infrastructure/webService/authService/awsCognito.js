//TODO - userEntity를 넘겨주기 122번째 줄
//TODO : 예외처리 custom으로 만들어서 넘기기 : 처리 > usecase로 넘어가는 것 확인
//개별 클라우드 인증서비스의 실행클래스 - cognito
const AWS = require('../awsConfig');
const { error, success } = require('../../exceptions');
const { processingToken, checkExpiredPassword } = require('./awsMiddleware');

const userPoolId = process.env.AWS_COGNITO_USERPOOL_ID;
const clientId = process.env.AWS_APP_CLIENT_ID;
module.exports = class {
    constructor() {
        this.cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
    }
    // 이메일 존재여부 확인
    async checkExistEmail(email) {
        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > checkExistEmail : ',
            email
        );
        var params = {
            UserPoolId: userPoolId /* required */,
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
                        // an error occurred
                        console.log(err, err.stack);
                        reject(err);
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > checkExistEmail : ',
                            data
                        );
                        let userExist = data.Users.length ? true : false;
                        resolve(userExist);
                    }
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
            ClientId: clientId /* required */,
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
                    Value: `${Math.floor(new Date().valueOf() / 1000)}`,
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
            ],
            /* more items */
            // AnalyticsMetadata: {
            //     AnalyticsEndpointId: 'STRING_VALUE',
            // },
            // ClientMetadata: {
            //     '<StringType>': 'STRING_VALUE',
            //     /* '<StringType>': ... */
            // },
            // SecretHash: process.env.SECRET_KEY,
            // UserContextData: {
            //     EncodedData: 'STRING_VALUE',
            // },
            /* more items */
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
                        resolve(success.signUpSuccess(data));
                    }
                }
            );
        });
        return result;
    }
    // 로그인
    logIn(userData) {
        let self = this;
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
            ClientId: clientId /* required */,
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
                async function (err, data) {
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
                                let failCount = await self.getRetryCount(
                                    userData.email
                                );
                                failCount += 1;
                                await self.setRetryCount(
                                    userData.email,
                                    failCount
                                );
                                err.retryCount = failCount;
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
                            data.AuthenticationResult
                        );
                        let response = data.AuthenticationResult;
                        self.resetRetryCount(response.AccessToken); // 로그인 시도 리셋

                        let userInfo = processingToken.decodeToken(
                            response.IdToken
                        );
                        userInfo.then((res) => {
                            let userType = res['custom:userType'];
                            response.userType = userType; // 사용자 타입

                            let passwordUpdatedAt =
                                res['custom:passwordUpdatedAt'];
                            response.isPasswordExpired = checkExpiredPassword(
                                passwordUpdatedAt // 비밀번호 만료여부
                            );

                            resolve(success.logInSuccess(response));
                        });
                    }
                }
            );
        });
    }
    //로그아웃
    //TODO : 예외처리 custom으로 만들어서 넘기기
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
                                // 토큰 만료 : 리프레시 토큰 필요
                                reject(error.accessTokenExpired(err));
                            } else if (
                                // 토큰 취소 : 로그인 필요
                                err.message === 'Access Token has been revoked'
                            ) {
                                reject(error.tokenRevoked(err));
                            } else if (err.message === 'Invalid Access Token') {
                                // 유효하지 않은 토큰 : 로그인 필요
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
                        resolve(success.logOutSuccess());
                    }
                }
            );
        });
    }
    // access token 만료 날짜 확인
    async checkAccessToken(token) {
        let result = await processingToken.checkAccessToken(token);
        return result;
    }
    // 새 access 토큰 발행
    issueNewToken(refreshToken) {
        var params = {
            AuthFlow: 'REFRESH_TOKEN',
            // 'REFRESH_TOKEN_AUTH',
            // | REFRESH_TOKEN , /* required */
            ClientId: clientId /* required */,
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
    // 사용자 가입정보 가져오기 : idToken
    async getUserByIdToken(idToken) {
        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > getUserByIdToken : '
            // token
        );
        let result = await processingToken.getUserByIdToken(idToken);
        console.log('응답 : ', result);
        return result;
    }
    // 사용자 접근정보 확인 : accessToken
    getUserInfo(accessToken) {
        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > getUserInfo : '
            // token
        );
        var params = {
            AccessToken: `${accessToken}` /* required */,
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
    // 로그인 시도 횟수 리셋
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
    // 로그인 시도 횟수 가져오기
    getRetryCount(email) {
        var params = {
            UserPoolId: userPoolId /* required */,
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
    // 로그인 시도 횟수 수정
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
            UserPoolId: userPoolId /* required */,
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
    // 사용자 비밀번호 변경
    changePassword({ token, prePassword, newPassword }) {
        let self = this;
        let params = {
            AccessToken: token /* required */,
            PreviousPassword: prePassword /* required */,
            ProposedPassword: newPassword /* required */,
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.changePassword(
                params,
                async function (err, data) {
                    if (err) {
                        // an error occurred
                        console.log(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js >  changePassword : ',
                            err
                        );
                        reject(err);
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > changePassword : ',
                            data
                        );
                        await self.changePassordUpdatedAt(token);
                        resolve(data);
                    }
                }
            );
        });
    }
    // 비밀번호 수정 날짜 변경
    changePassordUpdatedAt(token) {
        var params = {
            AccessToken: token /* required */,
            UserAttributes: [
                /* required */
                {
                    Name:
                        'custom:passwordUpdatedAt' /* required */,
                    Value: `${Math.floor(
                        new Date().valueOf() / 1000
                    )}`,
                },
                /* more items */
            ],
            // ClientMetadata: {
            //     '<StringType>': 'STRING_VALUE',
            //     /* '<StringType>': ... */
            // },
        };
        await self.changeAttribute(params);
    }
    // 사용자 속성값 변경
    changeAttribute(params) {
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.updateUserAttributes(
                params,
                function (err, data) {
                    if (err) {
                        // an error occurred
                        console.log(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js >  changeAttribute : ',
                            err
                        );
                        reject(err);
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > changeAttribute : ',
                            data
                        );
                        resolve(data);
                    }
                }
            );
        });
    }
    // 비밀번호 찾기 : 확인코드 보내기
    forgotPassword(email) {
        var params = {
            ClientId: clientId /* required */,
            Username: email /* required */,
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
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.forgotPassword(
                params,
                function (err, data) {
                    if (err) {
                        // an error occurred
                        console.log(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js >  forgotPassword : ',
                            err
                        );
                        reject(err);
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > forgotPassword : ',
                            data
                        );
                        resolve(data);
                    }
                }
            );
        });
    }
    // 비밀번호 찾기 : 확인코드와 함께 비밀번호 수정
    confirmForgotPassword({ email, code, password }) {
        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > confirmForgotPasword : ',
            email,
            code,
            password
        );
        var params = {
            ClientId: clientId /* required */,
            ConfirmationCode: code /* required */,
            Password: password /* required */,
            Username: email /* required */,
            // AnalyticsMetadata: {
            //   AnalyticsEndpointId: 'STRING_VALUE'
            // },
            // ClientMetadata: {
            //   '<StringType>': 'STRING_VALUE',
            //   /* '<StringType>': ... */
            // },
            // SecretHash: 'STRING_VALUE',
            // UserContextData: {
            //   EncodedData: 'STRING_VALUE'
            // }
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.confirmForgotPassword(
                params,
                function (err, data) {
                    if (err) {
                        // an error occurred
                        console.log(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js >  confirmForgotPassword : ',
                            err
                        );
                        reject(err);
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > confirmForgotPassword : ',
                            data
                        );
                        await self.changePassordUpdatedAt(token);
                        resolve(data);
                    }
                }
            );
        });
    }
    // // 비밀번호 만료기간 가져오기
    // getPasswordExp(email) {
    //     var params = {
    //         UserPoolId: userPoolId /* required */,
    //         Username: `${email}` /* required */,
    //     };
    //     return new Promise((resolve, reject) => {
    //         this.cognitoidentityserviceprovider.adminGetUser(
    //             params,
    //             function (err, data) {
    //                 if (err) {
    //                     // an error occurred
    //                     console.log(
    //                         '에러 응답 > Infrastructure > webService > authService > awsCognito.js >  getUserInfoByAdmin : ',
    //                         err
    //                     );
    //                     reject(err);
    //                 } else {
    //                     // successful response
    //                     console.log(
    //                         '응답 > Infrastructure > webService > authService > awsCognito.js > getUserInfoByAdmin : ',
    //                         data
    //                     );
    //                     let count;
    //                     let attributes = data.UserAttributes;
    //                     for (let i = 0; i < attributes.length; i++) {
    //                         if (attributes[i].Name === 'custom:retryCount') {
    //                             count = Number(attributes[i].Value);
    //                             break;
    //                         }
    //                     }
    //                     resolve(count);
    //                 }
    //             }
    //         );
    //     });
    // }

    //테스트 관리자코드------------------------------------------------------------
    // 관리자 회원 삭제
    deleteUserByAdmin(id) {
        let params = {
            UserPoolId: userPoolId /* required */,
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
            UserPoolId: userPoolId /* required */,
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
            UserPoolId: userPoolId /* required */,
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
    //         UserPoolId: userPoolId /* required */,
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
};
