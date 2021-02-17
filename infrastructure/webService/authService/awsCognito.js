//개별 클라우드 인증서비스의 실행클래스 - cognito
const AWS = require('../aws');
module.exports = class {
    constructor() {
        this.cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
    }
    cognitoService() {
        console.log(
            'Infrastructure > webService > authService > awsCognito.js - cognitoService!! : '
        );
        return 'Cognito Success';
    }
    getUser() {
        console.log(
            'Infrastructure > webService > authService > awsCognito.js - getUser!! : '
        );
        return 'Cognito Success : getUser';
    }

    // 회원 가입
    signup({ email }) {
        this.getEmail(email);
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
};
