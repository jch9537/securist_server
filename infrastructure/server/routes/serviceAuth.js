// 미들웨어 : 서버에서 오는 API로 요청왔을 시에 토큰을 확인

// 처음 서비스의 로그인 시 토큰 발급

// 서비스별 데이터 env 파일에 저장 : 서비스 타입, 서비스 id, 서비스 비밀번호

// 토큰 저장은 storage 라는 라이브러리 사용

// 토큰생성(로그인)/ 토큰 갱신 api 생성
const axios = require('axios');
module.exports = (router) => {
    // 각 서비스 인증 요청받기
    router.post('/service/issuetoken', async (req, res) => {
        let result;
        try {
            let reqBodyData = req.filteredBody;
            console.log('타 서비스 요청 데이터 ', reqBodyData);
            if (reqBodyData.serviceType === process.env.PROJECT_SERVICE_TYPE) {
                console.log('유저 서비스 인증 : ', reqBodyData);
                result = '프로젝트 서비스 > 유저 서비스 연결 완료';
            } else if (
                reqBodyData.serviceType === process.env.ADMIN_SERVICE_TYPE
            ) {
                console.log('프로젝트 서비스 인증 : ', reqBodyData);
                result = '어드민 서비스 > 유저 서비스 연결 완료';
            } else {
                throw new Error('접근할 수 없는 서비스입니다.');
            }
            res.send(result);
        } catch (error) {
            res.send(error);
        }
    });
    // access token이 만료되었을 때 refresh token으로 갱신 처리
    router.post('/service/renewtoken', async (req, res) => {});

    //--------------------------------------------------------------------------

    // 어드민 서비스 인증 요청 -------------------------------------------
    router.get('/service/admin/auth', async (req, res) => {
        let result;
        try {
            // 연결 - 에러 확인
            // 여기 코드를 미들웨어로 정리
            result = await axios({
                url: `http://localhost:5500/service/issuetoken`,
                method: 'post',
                data: {
                    serviceName: process.env.USER_SERVICE_NAME,
                    serviceType: process.env.USER_SERVICE_TYPE,
                    servicePassword: process.env.USER_SERVICE_PASSWORD,
                },
            });
            console.log('~~~~~~~~~~~~', result.data);
            res.send({
                message: '유저 서비스 연결성공',
                data: result.data,
            });
        } catch (error) {
            res.send(error);
        }
    });
    // 프로젝트 서비스 인증 요청-------------------------------------------
    router.get('/service/project/auth', async (req, res) => {
        let result;
        try {
            // 연결 - 에러 확인
            // 여기 코드를 미들웨어로 정리
            result = await axios({
                url: `http://localhost:5000/service/issuetoken`,
                method: 'post',
                data: {
                    serviceName: process.env.USER_SERVICE_NAME,
                    serviceType: process.env.USER_SERVICE_TYPE,
                    servicePassword: process.env.USER_SERVICE_PASSWORD,
                },
            });
            console.log('~~~~~~~~~~~~', result.data);
            res.send({
                message: '유저 서비스 연결성공',
                data: result.data,
            });
        } catch (error) {
            res.send(error);
        }
    });
};
