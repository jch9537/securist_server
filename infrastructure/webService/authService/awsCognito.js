//개별 클라우드 인증서비스의 실행클래스 - cognito
const AWS = require('../awsConfig');
const { processingToken, checkExpiredPassword } = require('./awsMiddleware');
// const { Exception } = require('../../../adapters/exceptions');
const { AuthServiceError, TokenError } = require('../../response');

const userPoolId = process.env.AWS_COGNITO_USERPOOL_ID;
const clientId = process.env.AWS_APP_CLIENT_ID;
module.exports = class {
    constructor() {
        this.cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
    }
    // 이메일 존재여부 확인
    async checkExistEmail({ email }) {
        let result;

        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > checkExistEmail : ',
            email
        );
        const params = {
            UserPoolId: userPoolId,
            // AttributesToGet: ['emai'],
            Filter: `email = \"${email}\"`,
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.listUsers(
                params,
                function (error, data) {
                    if (error) {
                        console.error(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js > checkExistEmail : ',
                            error
                        );
                        // an error occurred
                        reject(
                            new AuthServiceError(
                                error.message,
                                error.statusCode,
                                error.code,
                                error
                            )
                        );
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > checkExistEmail : data ',
                            data
                        );
                        result = data.Users;
                        resolve(result);
                    }
                }
            );
        });
    }
    // 사용자 회원 가입
    signUp({ email, password, name, userType }) {
        let result;
        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > signup : ',
            { email, password, name, userType }
        );
        let params = {
            ClientId: clientId /* required */,
            Password: password /* required */,
            Username: email /* required */,
            ValidationData: [
                {
                    Name: 'email' /* required */,
                    Value: email,
                },
            ],
            UserAttributes: [
                {
                    Name: 'email' /* required */,
                    Value: email,
                },
                {
                    Name: 'name',
                    Value: name,
                },
                {
                    Name: 'custom:userType',
                    Value: `${userType}`,
                },
                {
                    Name: 'custom:retryCount', // 로그인 실패횟수
                    Value: '0',
                },
                {
                    // Name: 'custom:passwordUpdatedAt', // 비밀번호변경시간
                    Name: 'custom:passwordUpdateDate', // 비밀번호변경시간
                    Value: `${Math.floor(new Date().valueOf() / 1000)}`,
                },
                // 아래 로그인 잠금상태/정보변경시간/회원가입날짜시간(변경불가) 의 경우 계정이 존재하면 기본적으로 cognito 응답 Users배열 내 Enabled / UserCreateDate / UserLastModifiedDate가 있어서 필요없음
            ],
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.signUp(
                params,
                function (error, data) {
                    if (error) {
                        console.error(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js > signup : ',
                            error
                        );

                        reject(
                            new AuthServiceError(
                                error.message,
                                error.statusCode,
                                error.code,
                                error
                            )
                        );
                    } else {
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > signup : ',
                            data
                        );
                        result = data;
                        resolve(result);
                    }
                }
            );
        });
    }
    // 가입 확인 메일 재전송
    resendComfirmEmail({ email }) {
        const params = {
            ClientId: clientId /* required */,
            Username: email /* required */,
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.resendConfirmationCode(
                params,
                function (error, data) {
                    if (error) {
                        // an error occurred
                        console.log(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js > resendComfirmEmail : ',
                            error
                        );
                        reject(
                            new AuthServiceError(
                                error.message,
                                error.statusCode,
                                error.code,
                                error
                            )
                        );
                    } else {
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > resendComfirmEmail : ',
                            data
                        ); // successful response
                        resolve(data);
                    }
                }
            );
        });
    }
    // 로그인
    logIn({ email, password }) {
        let self = this;
        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > logIn : ',
            { email, password }
        );
        let params = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: clientId /* required */,
            AuthParameters: {
                USERNAME: `${email}`,
                PASSWORD: `${password}`,
            },
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.initiateAuth(
                params,
                async function (error, data) {
                    if (error) {
                        // an error occurred
                        if (
                            error.code === 'NotAuthorizedException' &&
                            error.message === 'Incorrect username or password.'
                        ) {
                            try {
                                let failCount = await self.getRetryCount(email);
                                console.log('failCount', failCount);
                                failCount += 1;
                                await self.setRetryCount(email, failCount);
                                error.failCount = failCount;
                                reject(
                                    new AuthServiceError(
                                        error.message,
                                        error.statusCode,
                                        error.code,
                                        error
                                    )
                                );
                                console.error(
                                    '에러 응답 > Infrastructure > webService > authService > awsCognito.js > logIn 1 : ',
                                    error
                                );
                            } catch (error) {
                                reject(
                                    new AuthServiceError(
                                        error.message,
                                        error.statusCode,
                                        error.code,
                                        error
                                    )
                                );
                            }
                        } else {
                            console.error(
                                '에러 응답 > Infrastructure > webService > authService > awsCognito.js > logIn 2 : ',
                                error
                            );
                            reject(
                                new AuthServiceError(
                                    error.message,
                                    error.statusCode,
                                    error.code,
                                    error.retryCount
                                )
                            );
                        }
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > logIn : ',
                            data.AuthenticationResult
                        );
                        let result = data.AuthenticationResult;
                        self.resetRetryCount(result.AccessToken); // 로그인 시도 리셋

                        let userInfo = processingToken.decodeToken(
                            result.IdToken
                        );
                        userInfo
                            .then((res) => {
                                let userType = res['custom:userType'];
                                result.userType = userType; // 사용자 타입

                                // let passwordUpdatedAt =
                                //     res['custom:passwordUpdatedAt'];
                                let passwordUpdateDate =
                                    res['custom:passwordUpdateDate'];
                                // result.isPasswordExpired = checkExpiredPassword(
                                //     passwordUpdatedAt // 비밀번호 만료여부
                                // );
                                result.isPasswordExpired = checkExpiredPassword(
                                    passwordUpdateDate // 비밀번호 만료여부
                                );
                                resolve(result);
                            })
                            .catch((error) => {
                                console.error(
                                    '에러 응답 > Infrastructure > webService > authService > awsCognito.js > logIn 3 : ',
                                    error
                                );
                                reject(
                                    new AuthServiceError(
                                        error.message,
                                        error.statusCode,
                                        error.code,
                                        error
                                    )
                                );
                            });
                    }
                }
            );
        });
    }
    //로그아웃
    logOut(accessToken) {
        let result;
        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > logOut : '
            // accessToken
        );
        const params = {
            AccessToken: `${accessToken}` /* required */,
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.globalSignOut(
                params,
                function (error, data) {
                    if (error) {
                        // an error occurred
                        /*추가할 예외처리
                        ResourceNotFoundException
                        */
                        console.error(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js > logOut : ',
                            error
                        );
                        reject(
                            new AuthServiceError(
                                error.message,
                                error.statusCode,
                                error.code,
                                error
                            )
                        );
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > logOut : ',
                            data
                        );
                        result = data;
                        resolve(result);
                    }
                }
            );
        });
    }

    // 새 access 토큰 발행
    issueNewToken(refreshToken) {
        let result;
        const params = {
            AuthFlow: 'REFRESH_TOKEN',
            ClientId: clientId /* required */,
            AuthParameters: {
                REFRESH_TOKEN: `${refreshToken}`,
            },
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.initiateAuth(
                params,
                function (error, data) {
                    if (error) {
                        // an error occurred
                        console.error(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js >  issueNewToken : ',
                            error
                        );
                        reject(
                            new AuthServiceError(
                                error.message,
                                error.statusCode,
                                error.code,
                                error
                            )
                        );
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > issueNewToken : ',
                            data
                        );
                        result = data.AuthenticationResult;

                        resolve(result);
                    }
                }
            );
        });
    }

    // 로그인 시도 횟수 리셋 : accessToken
    resetRetryCount(accessToken) {
        let result;
        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > resetLogInCount : ',
            accessToken
        );
        const params = {
            AccessToken: `${accessToken}` /* required */,
            UserAttributes: [
                {
                    Name: 'custom:retryCount' /* required */,
                    Value: '0',
                },
            ],
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.updateUserAttributes(
                params,
                function (error, data) {
                    // an error occurred
                    if (error) {
                        console.error(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js > resetLogInCount : ',
                            error
                        );
                        reject(
                            new AuthServiceError(
                                error.message,
                                error.statusCode,
                                error.code,
                                error
                            )
                        );
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > resetLogInCount : ',
                            data
                        );
                        result = data;
                        resolve(result);
                    }
                }
            );
        });
    }
    // 로그인 시도 횟수 가져오기
    getRetryCount(email) {
        const params = {
            UserPoolId: userPoolId /* required */,
            Username: `${email}` /* required */,
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.adminGetUser(
                params,
                function (error, data) {
                    if (error) {
                        // an error occurred
                        console.error(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js >  getUserInfoByAdmin : ',
                            error
                        );
                        reject(
                            new AuthServiceError(
                                error.message,
                                error.statusCode,
                                error.code,
                                error
                            )
                        );
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
        let result;
        const params = {
            UserAttributes: [
                {
                    Name: 'custom:retryCount',
                    Value: `${count}`,
                },
            ],
            UserPoolId: userPoolId,
            Username: `${email}`,
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.adminUpdateUserAttributes(
                params,
                function (error, data) {
                    if (error) {
                        // an error occurred
                        console.error(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js >  setRetryCount : ',
                            error
                        );
                        reject(
                            new AuthServiceError(
                                error.message,
                                error.statusCode,
                                error.code,
                                error
                            )
                        );
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > setRetryCount : ',
                            data
                        );
                        result = data;
                        resolve(result);
                    }
                }
            );
        });
    }
    // 사용자 인증 : 비밀번호
    verifyUserByPassword({ email, password }) {
        let result;
        console.log('코그니토 : ', { email, password });
        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > logIn : ',
            { email, password }
        );
        let params = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: clientId /* required */,
            AuthParameters: {
                USERNAME: `${email}`,
                PASSWORD: `${password}`,
            },
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.initiateAuth(
                params,
                function (error, data) {
                    if (error) {
                        // an error occurred
                        console.error(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js >  verifyUserByPassword : ',
                            error
                        );
                        reject(
                            new AuthServiceError(
                                error.message,
                                error.statusCode,
                                error.code,
                                error
                            )
                        );
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > verifyUserByPassword : ',
                            data.AuthenticationResult
                        );
                        result = data.AuthenticationResult;
                        resolve(result);
                    }
                }
            );
        });
    }
    // 사용자 비밀번호 변경
    changePassword({ accessToken, prePassword, newPassword }) {
        let result;
        let self = this;
        let params = {
            AccessToken: accessToken,
            PreviousPassword: prePassword,
            ProposedPassword: newPassword,
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.changePassword(
                params,
                async function (error, data) {
                    if (error) {
                        // an error occurred
                        console.error(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js >  changePassword : ',
                            error
                        );
                        reject(
                            new AuthServiceError(
                                error.message,
                                error.statusCode,
                                error.code,
                                error
                            )
                        );
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > changePassword : ',
                            data
                        );
                        result = data;
                        await self.changePassordUpdatedAt(accessToken);
                        resolve(result);
                    }
                }
            );
        });
    }
    // 비밀번호 수정 날짜 변경
    async changePassordUpdatedAt(token) {
        let self = this;
        try {
            const params = {
                AccessToken: token,
                UserAttributes: [
                    {
                        // Name: 'custom:passwordUpdatedAt',
                        Name: 'custom:passwordUpdateDate',
                        Value: `${Math.floor(new Date().valueOf() / 1000)}`,
                    },
                ],
            };
            return await self.changeAttribute(params);
        } catch (error) {
            throw error;
        }
    }
    // 사용자 속성값 변경
    changeAttribute(params) {
        let result;
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.updateUserAttributes(
                params,
                function (error, data) {
                    if (error) {
                        // an error occurred
                        console.error(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js >  changeAttribute : ',
                            error
                        );
                        reject(
                            new AuthServiceError(
                                error.message,
                                error.statusCode,
                                error.code,
                                error
                            )
                        );
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > changeAttribute : ',
                            data
                        );
                        result = data;
                        resolve(result);
                    }
                }
            );
        });
    }
    // 비밀번호 찾기 : 확인코드 보내기
    async forgotPassword({ email }) {
        let result;
        let self = this;
        let userExist = await self.checkExistEmail({ email });
        console.log('--------------------------비밀번호 찾기', userExist);
        if (!userExist.length) {
            return false;
        } else {
            const params = {
                ClientId: clientId,
                Username: email,
            };
            return new Promise((resolve, reject) => {
                this.cognitoidentityserviceprovider.forgotPassword(
                    params,
                    function (error, data) {
                        if (error) {
                            // an error occurred
                            console.error(
                                '에러 응답 > Infrastructure > webService > authService > awsCognito.js >  forgotPassword : ',
                                error
                            );
                            reject(
                                new AuthServiceError(
                                    error.message,
                                    error.statusCode,
                                    error.code,
                                    error
                                )
                            );
                        } else {
                            // successful response
                            console.log(
                                '응답 > Infrastructure > webService > authService > awsCognito.js > forgotPassword : ',
                                data
                            );
                            result = data;
                            resolve(result);
                        }
                    }
                );
            });
        }
    }
    // 비밀번호 찾기 : 확인코드와 함께 비밀번호 수정
    confirmForgotPassword({ email, code, password }) {
        let result;
        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > confirmForgotPasword : ',
            email,
            code,
            password
        );
        const params = {
            ClientId: clientId,
            ConfirmationCode: `${code}`,
            Password: password,
            Username: email,
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.confirmForgotPassword(
                params,
                function (error, data) {
                    if (error) {
                        // an error occurred
                        console.error(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js >  confirmForgotPassword : ',
                            error
                        );
                        reject(
                            new AuthServiceError(
                                error.message,
                                error.statusCode,
                                error.code,
                                error
                            )
                        );
                    } else {
                        // successful response
                        console.log(
                            '응답 > Infrastructure > webService > authService > awsCognito.js > confirmForgotPassword : ',
                            data
                        );
                        result = data;
                        resolve(result);
                    }
                }
            );
        });
    }
    deleteUser(token) {
        const params = {
            AccessToken: token /* required */,
        };
        return new Promise((resolve, reject) => {
            cognitoidentityserviceprovider.deleteUser(
                params,
                function (error, data) {
                    if (error) {
                        console.error('deleteUser', error);
                        reject(
                            new AuthServiceError(
                                error.message,
                                error.statusCode,
                                error.code,
                                error
                            )
                        );
                    } else {
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
            UserPoolId: userPoolId /* required */,
            Username: id /* required */,
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.adminDeleteUser(
                params,
                function (error, data) {
                    if (error) {
                        console.error(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js > delteUserByAdmin : ',
                            error
                        );
                        reject(
                            new AuthServiceError(
                                error.message,
                                error.statusCode,
                                error.code,
                                error
                            )
                        );
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
        const params = {
            UserPoolId: userPoolId /* required */,
            Username: id /* required */,
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.adminDisableUser(
                params,
                function (error, data) {
                    if (error) {
                        // an error occurred
                        console.error(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js > disableUserByAdmin : ',
                            error
                        );
                        reject(
                            new AuthServiceError(
                                error.message,
                                error.statusCode,
                                error.code,
                                error
                            )
                        );
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
        const params = {
            UserPoolId: userPoolId /* required */,
            Username: id /* required */,
        };
        return new Promise((resolve, reject) => {
            this.cognitoidentityserviceprovider.adminEnableUser(
                params,
                function (error, data) {
                    if (error) {
                        // an error occurred
                        console.error(
                            '에러 응답 > Infrastructure > webService > authService > awsCognito.js > enableUserByAdmin : ',
                            error
                        );
                        reject(
                            new AuthServiceError(
                                error.message,
                                error.statusCode,
                                error.code,
                                error
                            )
                        );
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
    //             function (error, data) {
    //                 if (error) {
    //                     console.log(
    //                         '에러 응답 > Infrastructure > webService > authService > awsCognito.js > createUser : ',
    //                         error
    //                     );
    //                     reject(error);
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

    // ---------------------------현재 사용안함----------------------------------
    //  // 사용자 가입정보 가져오기 : accessToken - 현재 사용안함
    //  getUserInfoByAccessToken(accessToken) {
    //     console.log(
    //         '요청 > Infrastructure > webService > authService > awsCognito.js > getUserInfoByAccessToken : '
    //         // token
    //     );
    //     const params = {
    //         AccessToken: `${accessToken}` /* required */,
    //     };
    //     return new Promise((resolve, reject) => {
    //         this.cognitoidentityserviceprovider.getUser(
    //             params,
    //             function (error, data) {
    //                 if (error) {
    //                     // an error occurred
    //                     console.log(
    //                         '에러 응답 > Infrastructure > webService > authService > awsCognito.js > getUserInfoByAccessToken : ',
    //                         error
    //                     );
    //                     reject(
    //                         new AuthServiceError(
    //                             error.message,
    //                             error.statusCode,
    //                             error.code,
    //                             error
    //                         )
    //                     );
    //                 } else {
    //                     // successful response
    //                     console.log(
    //                         '응답 > Infrastructure > webService > authService > awsCognito.js > getUserInfoByAccessToken : ',
    //                         data
    //                     );
    //                     let result = {};
    //                     let userInfo = data.UserAttributes;
    //                     for (let i = 0; i < userInfo.length; i++) {
    //                         if (
    //                             userInfo[i]['Name'].substr(0, 7) === 'custom:'
    //                         ) {
    //                             let key = [userInfo[i]['Name'].substr(7)][0];
    //                             if (
    //                                 key === 'retryCount' ||
    //                                 key === 'userType'
    //                             ) {
    //                                 result[
    //                                     userInfo[i]['Name'].substr(7)
    //                                 ] = Number(userInfo[i]['Value']);
    //                             } else {
    //                                 result[userInfo[i]['Name'].substr(7)] =
    //                                     userInfo[i]['Value'];
    //                             }
    //                         } else {
    //                             result[userInfo[i]['Name']] =
    //                                 userInfo[i]['Value'];
    //                         }
    //                     }
    //                     resolve(result);
    //                 }
    //             }
    //         );
    //     });
    // }

    // // 비밀번호 만료기간 가져오기
    // getPasswordExp(email) {
    //     const params = {
    //         UserPoolId: userPoolId /* required */,
    //         Username: `${email}` /* required */,
    //     };
    //     return new Promise((resolve, reject) => {
    //         this.cognitoidentityserviceprovider.adminGetUser(
    //             params,
    //             function (error, data) {
    //                 if (error) {
    //                     // an error occurred
    //                     console.log(
    //                         '에러 응답 > Infrastructure > webService > authService > awsCognito.js >  getUserInfoByAdmin : ',
    //                         error
    //                     );
    //                     reject(error);
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

    // // 사용자 가입정보 가져오기 : idToken - 미들웨어 처리
    // async getUserByIdToken(idToken) {
    //     console.log(
    //         '요청 > Infrastructure > webService > authService > awsCognito.js > getUserByIdToken : '
    //         // token
    //     );
    //     try {
    //         let result = await processingToken.getUserByIdToken(idToken);
    //         console.log('응답 : ', result);
    //         return result;
    //     } catch (error) {
    //         throw new AuthServiceError(
    //             error.message,
    //             error.statusCode,
    //             error.code,
    //             error
    //         );
    //     }
    // }

    // 사용자 cognito 접근정보 가져오기 : accessToken - 미들웨어 처리
    // async getAuthInfoByAccessToken(accessToken) {
    //     console.log(
    //         '요청 > Infrastructure > webService > authService > awsCognito.js > getAuthInfoByAccessToken : '
    //         // token
    //     );
    //     try {
    //         let result = await processingToken.checkAccessToken(accessToken);
    //         console.log('응답 : ', result);
    //         return result;
    //     } catch (error) {
    //         // throw new AuthServiceError(
    //         //     error.message,
    //         //     error.statusCode,
    //         //     error.code,
    //         //     error
    //         // );
    //         console.log('cognito > getAuthInfoByAccessToken 에러 ', error);
    //         throw new AuthServiceError(
    //             'Cognito 접근 정보 가져오기 오류',
    //             error.statusCode
    //         );
    //     }
    // }

    // access token 만료 날짜 확인
    // async checkAccessToken(accessToken) {
    //     try {
    //         let result = await processingToken.checkAccessToken(accessToken);
    //         return result;
    //     } catch (error) {
    //         console.log('cognito > checkAccessToken 에러 ', error);
    //         throw new AuthServiceError(
    //             '토큰 만료 날짜 확인 오류 : 다시 로그인 해주세요',
    //             error.statusCode
    //         );
    //     }
    // }
};
