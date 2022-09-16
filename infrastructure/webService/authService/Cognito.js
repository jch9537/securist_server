//개별 클라우드 인증서비스의 실행클래스 - cognito
const AWS = require('../awsConfig');
// const processingToken = require('./processingToken');
const { AuthServiceError } = require('../../../adapters/error');
// const {
//     TRANSACTION_TRANSPORT_CATEGORY,
// } = require('@sentry/core/dist/transports/base');

const userPoolId = process.env.AWS_COGNITO_USERPOOL_ID;
const clientId = process.env.AWS_APP_CLIENT_ID;
module.exports = class Cognito {
    constructor() {
        this.cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
    }
    // 이메일 존재여부 확인
    async checkExistUser({ email }) {
        try {
            const params = {
                UserPoolId: userPoolId,
                // AttributesToGet: ['emai'],
                Filter: `email = \"${email}\"`,
            };
            let userListResult = await this.cognitoidentityserviceprovider
                .listUsers(params)
                .promise();

            if (!!userListResult.Users.length) {
                // 이미 등록한 사용자가 있다면 에러 응답
                throw Error('Already Exist');
            } else {
                // 없다면 회원가입 가능 : 응답값 없음
                return;
            }
        } catch (error) {
            // console.error(
            //     '에러 응답 > Infrastructure > webService > authService > Cognito.js > checkExistUser : ',
            //     error
            // );
            throw new AuthServiceError(error.message, error.data);
        }
    }
    // 사용자 회원 가입
    async signUp({ email, password, name, userType }) {
        try {
            let params = {
                ClientId: clientId,
                Password: password,
                Username: email,
                ValidationData: [
                    {
                        Name: 'email',
                        Value: email,
                    },
                ],
                UserAttributes: [
                    {
                        Name: 'email',
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

            let signUpResult = await this.cognitoidentityserviceprovider
                .signUp(params)
                .promise();
            return;
        } catch (error) {
            console.error(error);
            throw new AuthServiceError(error.message, error.data);
        }
    }
    // 가입 확인 메일 재전송
    async resendSignUpEmail({ email }) {
        const params = {
            ClientId: clientId,
            Username: email,
        };
        try {
            await this.cognitoidentityserviceprovider
                .resendConfirmationCode(params)
                .promise();
        } catch (error) {
            console.error(error);
            throw new AuthServiceError(error.message, error.data);
        }
    }
    // 로그인
    async logIn({ email, password }) {
        let self = this;
        try {
            let params = {
                AuthFlow: 'USER_PASSWORD_AUTH',
                ClientId: clientId /* required */,
                AuthParameters: {
                    USERNAME: `${email}`,
                    PASSWORD: `${password}`,
                },
            };
            console.log('로그인 파라미터 ', params);
            let loginResult = await this.cognitoidentityserviceprovider
                .initiateAuth(params)
                .promise();

            // 로그인
            let loginData = loginResult.AuthenticationResult;
            await self.resetRetryCount(loginData.AccessToken); // 로그인 시도 리셋
            // }
            return loginData;
        } catch (error) {
            console.error(error);
            if (
                error.message === 'Incorrect username or password.' ||
                error.message === 'Password attempts exceeded'
            ) {
                let failCount = await self.getRetryCount(email); // 여기 확인하고 추가처리!!!
                console.log('failCount', failCount);
                // 로그인 시도 횟수 증가
                failCount += 1;
                await self.setRetryCount(email, failCount);
                error.data = { tryCount: failCount };
            }
            throw new AuthServiceError(error.message, error.data);
        }
    }
    //로그아웃
    async logOut(accessToken) {
        try {
            const params = {
                AccessToken: `${accessToken}`,
            };

            // let result =
            await this.cognitoidentityserviceprovider
                .globalSignOut(params)
                .promise();
            return;
        } catch (error) {
            throw new AuthServiceError(error.message, error.data);
        }
    }
    // 새 access 토큰 발행
    async reissueToken(refreshToken) {
        try {
            const params = {
                AuthFlow: 'REFRESH_TOKEN',
                ClientId: clientId /* required */,
                AuthParameters: {
                    REFRESH_TOKEN: `${refreshToken}`,
                },
            };

            let newTokenResult = await this.cognitoidentityserviceprovider
                .initiateAuth(params)
                .promise();

            return newTokenResult.AuthenticationResult;
        } catch (error) {
            console.error(error);
            throw new AuthServiceError(error.message, error.data);
        }
    }
    // 로그인 시도 횟수 리셋 : accessToken
    async resetRetryCount(accessToken) {
        try {
            const params = {
                AccessToken: `${accessToken}` /* required */,
                UserAttributes: [
                    {
                        Name: 'custom:retryCount' /* required */,
                        Value: '0',
                    },
                ],
            };
            await this.cognitoidentityserviceprovider
                .updateUserAttributes(params)
                .promise();
            return;
        } catch (error) {
            console.error(error);
            throw new AuthServiceError(error.message, error.data);
        }
    }
    // 로그인 시도 횟수 가져오기
    async getRetryCount(email) {
        try {
            let count;
            const params = {
                UserPoolId: userPoolId,
                Username: `${email}`,
            };

            let UserInfoResult = await this.cognitoidentityserviceprovider
                .adminGetUser(params)
                .promise();

            let attributes = UserInfoResult.UserAttributes;
            for (let i = 0; i < attributes.length; i++) {
                if (attributes[i].Name === 'custom:retryCount') {
                    count = Number(attributes[i].Value);
                    break;
                }
            }
            return count;
        } catch (error) {
            console.error(error);
            throw new AuthServiceError(error.message, error.data);
        }
    }
    // 로그인 시도 횟수 수정
    async setRetryCount(email, count) {
        try {
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
            await this.cognitoidentityserviceprovider
                .adminUpdateUserAttributes(params)
                .promise();
            return;
        } catch (error) {
            console.error(error);
            throw new AuthServiceError(error.message, error.data);
        }
    }
    // 사용자 인증 : 비밀번호
    async verifyUserByPassword({ email, password }) {
        console.log('코그니토 : ', { email, password });
        console.log(
            '요청 > Infrastructure > webService > authService > awsCognito.js > logIn : ',
            { email, password }
        );
        try {
            const params = {
                AuthFlow: 'USER_PASSWORD_AUTH',
                ClientId: clientId,
                AuthParameters: {
                    USERNAME: `${email}`,
                    PASSWORD: `${password}`,
                },
            };

            let verifyUserResults = await this.cognitoidentityserviceprovider
                .initiateAuth(params)
                .promise();

            let verifyUserData = verifyUserResults.AuthenticationResult;
            return verifyUserData;
        } catch (error) {
            console.error(error);
            throw new AuthServiceError(error.message, error.data);
        }
    }
    // 사용자 비밀번호 변경
    async changePassword({ prePassword, newPassword }, accessToken) {
        let self = this;
        try {
            let params = {
                AccessToken: accessToken,
                PreviousPassword: prePassword,
                ProposedPassword: newPassword,
            };

            // let result1 =
            await this.cognitoidentityserviceprovider
                .changePassword(params)
                .promise();

            // let result2 =
            await self.changePassordUpdatedAt(accessToken);

            return;
        } catch (error) {
            console.error(error);
            throw new AuthServiceError(error.message, error.data);
        }
    }
    // 비밀번호 수정 날짜 변경
    async changePassordUpdatedAt(accessToken) {
        let self = this;
        try {
            const params = {
                AccessToken: accessToken,
                UserAttributes: [
                    {
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
    async changeAttribute(params) {
        try {
            let changeAttributeResult = await this.cognitoidentityserviceprovider
                .updateUserAttributes(params)
                .promise();
            return changeAttributeResult;
        } catch (error) {
            console.error(error);
            throw new AuthServiceError(error.message, error.data);
        }
    }
    // 비밀번호 찾기 : 확인코드 보내기
    async findPassword({ email }) {
        try {
            const params = {
                ClientId: clientId,
                Username: email,
            };

            // let result =
            await this.cognitoidentityserviceprovider
                .forgotPassword(params)
                .promise();
        } catch (error) {
            console.error(error);
            throw new AuthServiceError(error.message, error.data);
        }
    }
    // 비밀번호 찾기 : 확인코드와 함께 비밀번호 수정
    async updateForgotPassword({ email, code, password }) {
        try {
            const params = {
                ClientId: clientId,
                ConfirmationCode: `${code}`,
                Password: password,
                Username: email,
            };

            let result = await this.cognitoidentityserviceprovider
                .confirmForgotPassword(params)
                .promise();
            return;
        } catch (error) {
            console.error(error);
            throw new AuthServiceError(error.message, error.data);
        }
    }
    // deleteUser(accessToken) {
    //     const params = {
    //         AccessToken: accessToken,
    //     };
    //     return new Promise((resolve, reject) => {
    //         cognitoidentityserviceprovider.deleteUser(
    //             params,
    //             function (error, data) {
    //                 if (error) {
    //                     console.error('deleteUser', error);
    //                     reject(
    //                         new AuthServiceError(
    //                             error.message,
    //                             error.statusCode,
    //                             error.code,
    //                             error
    //                         )
    //                     );
    //                 } else {
    //                     resolve(data);
    //                 }
    //             }
    //         );
    //     });
    // }

    //테스트 관리자코드------------------------------------------------------------

    // 관리자 회원 삭제
    async deleteUserByAdmin({ email }) {
        try {
            const params = {
                UserPoolId: userPoolId /* required */,
                Username: email /* required */,
            };

            await this.cognitoidentityserviceprovider
                .adminDeleteUser(params)
                .promise();
            return;
        } catch (error) {
            console.error(error);
            throw new AuthServiceError(error.message, error.data);
        }
    }
    //관리자 회원 비활성화
    async disableUserByAdmin(id) {
        try {
            const params = {
                UserPoolId: userPoolId /* required */,
                Username: id /* required */,
            };

            await this.cognitoidentityserviceprovider
                .adminDisableUser(params)
                .promise();
            return;
        } catch (error) {
            console.error(error);
            throw new AuthServiceError(error.message, error.data);
        }
    }
    //관리자 회원 활성화
    async enableUserByAdmin(id) {
        try {
            const params = {
                UserPoolId: userPoolId,
                Username: id,
            };

            await this.cognitoidentityserviceprovider
                .adminEnableUser(params)
                .promise();
        } catch (error) {
            console.error(error);
            throw new AuthServiceError(error.message, error.data);
        }
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
