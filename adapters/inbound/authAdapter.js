// 테스트용 사용자 삭제
//TODO token처리, 로그인 시도횟수제한 위치 확인 및 코드작성
const awsCognito = require('../../infrastructure/webService/authService/awsCognito');

// signup, login, logout 어댑터
const { Auth, SendMail } = require('../outbound');
const { success, error } = require('../exceptions');
const { UserEntity, SignUp, LogIn, LogOut } = require('../../domain/user');

module.exports = {
    //Email 중복체크, 사용자 중복확인
    async findUserByEmail(email) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > findUserByEmail - email : ',
            email
        );
        try {
            let result = await Auth.findUserByEmail(email);
            console.log(
                '응답 > adapters > inbound > authAdaptor.js > findUserByEmail - email : ',
                result
            );
            return result;
        } catch (err) {
            return err;
        }
    },
    // 회원가입
    /* 회원가입 확인 흐름 (사용자만 )
    1. 기가입 아이디 존재 확인 ? '이미 가입된 email입니다.' : next                                   - infra 에서 확인
    2. 각 input 정보 중 유효성 확인여부 ? next : '유효하지 않는 OOO입니다. OOO을 확인해주세요          - entity layer에서 exception 처리 
    3. 회원정보 생성(가입완료)

    -- 추가 회원가입시 기업정보 확인
    4. 사업자 번호 유효성 확인여부 ? next : '사업자 등록번호를 확인해주세요'
    5. DB 내 사업자 번호 이미 등록되어있나 ? next : 기업정보 생성 처리  
    6. 회원 가입 응답 전송
    */
    async signUp(userParam) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > signUp - userParam : ',
            userParam
        );
        try {
            let signUp = new SignUp(Auth);
            // 회원가입 > 자동 메일발송
            let result = await signUp.excute(userParam); //client에서 작성된 정보만 받음
            console.log(
                '응답 > adapters > inbound > authAdaptor.js > signUp - result : ',
                result
            );
            // 회원가입이 완료되면 기업정보 생성 (코드 추가!!)
            return success.signUpSucess(result);
        } catch (err) {
            return err;
        }
    },
    /* 로그인 확인 흐름
    1. 아이디 / 비밀번호 유효성 확인                                                       - entity layer에서 exception 처리
    2. 아이디 존재 확인 ? next : '아이디가 존재하지 않습니다'                                - 처리완료
    3. 존재하는 아이디와 비밀번호 일치 확인 ? next : '비밀번호를 확인해주세요'                - 처리완료
    4. 계정인증 상태 확인 (이메일 인증여부) ? next : '이메일 계정확인 후 로그인 가능합니다'    - 처리완료
    5. 로그인 잠금상태 확인 (활성/비활성) ? 토큰 반환(로그인) : 
       5회이상 로그인 실패  ?  비밀번호찾기안내 : '계정이 잠금상태입니다. 관리자에게 문의해주세요' 
    6. 비밀번호 유효기간 초과 ? 비밀번호 변경 모달 노출 :  로그인 화면 리다이렉션
    */
    async logIn(userParam) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > logIn - userParam : ',
            userParam
        );
        try {
            let userExist = await this.findUserByEmail(userParam.email);
            console.log('userExist :', userExist);
            if (!userExist) {
                return error.userNotExist(userExist);
            } else {
                let logIn = new LogIn(Auth);
                let result = await logIn.excute(userParam);
                console.log(
                    '응답 > adapters > inbound > authAdaptor.js > logIn - result : ',
                    result
                );
                await Auth.resetRetryCount(result.AccessToken);

                // DB 또는 cognito 저장 : access토큰 만료시 id토큰으로 refresh 토큰을 가져와 인증 후 새 access 토큰 생성
                // let resData = {
                //     idToken: result.IdToken,
                //     accessToken: result.AccessToken,
                //     expiresIn: result.ExpiresIn,
                //     tokenType: result.TokenType,
                // };

                return success.logInSucess(result);
            }
        } catch (err) {
            if (err.isLogIn === false) {
                let failCount = await Auth.getRetryCount(userParam.email);
                console.log('Adapter > failCount : ', failCount);
                failCount += 1;
                await Auth.setRetryCount(userParam.email, failCount);
                err.retryCount = failCount;
            }
            return err;
        }
    },

    async logOut(token) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > logOut - token : ',
            token
        );
        try {
            let logOut = new LogOut(Auth);
            let result = await logOut.excute(token);
            console.log(
                '응답 > adapters > inbound > authAdaptor.js > logOut - result : ',
                result
            );
            return success.logOutSuccess();
        } catch (err) {
            return err;
        }
    },
    // async getRefreshToken()
    async issueNewToken(refreshToken) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > issueNewToken - refreshToken : ',
            refreshToken
        );
        try {
            let result = Auth.issueNewToken.excute(refreshToken);
            console.log(
                '응답 > adapters > inbound > authAdaptor.js > issueNewToken - result : ',
                result
            );
            return success.logOutSuccess();
        } catch (err) {
            return err;
        }
    },

    // async increaseLogInFailCount(){
    //     let result = await Auth.getUserInfo(token);
    //     console.log(
    //         '응답 > adapters > inbound > authAdaptor.js > resetLogInFailCount - result : ',
    //         result
    //     );
    //     let count;
    //     for(let i = 0; i >= result.length; i++){
    //         if(result[i].Name === 'custom:logInFailCount'){
    //             count = Number(result[i].Value)
    //             break;
    //         }
    //     }
    //     count += 1
    // }

    // 회원삭제
    async deleteUser(userParam) {
        try {
            var test = new awsCognito();
            let result = await test.deleteUserByAdmin(userParam.id);

            return result;
        } catch (err) {
            return err;
        }
    },
    async disableUser(userParam) {
        try {
            var test = new awsCognito();
            let result = await test.disableUserByAdmin(userParam.id);
            return result;
        } catch (err) {
            return err;
        }
    },
    async enableUser(userParam) {
        try {
            var test = new awsCognito();
            let result = await test.enableUserByAdmin(userParam.id);
            return result;
        } catch (err) {
            return err;
        }
    },
};
