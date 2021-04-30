const {
    authAdapter,
    userAdapter,
    relationAdapter,
} = require('../../../adapters/inbound');

const Response = require('../modules/Response');
const extractToken = require('../modules/extractToken');
const decryptIdToken = require('../modules/decryptIdToken');
// const decryptAccessToken = require('../modules/decryptAccessToken');
// const getUserInfoByAccessToken = require('../modules/getUserInfoByAccessToken');

module.exports = (router) => {
    router.use(extractToken);
    router.use(decryptIdToken);
    // 사용자-기업 연결정보 가져오기
    router.get('/api/relation/info', async (req, res) => {
        try {
            let userData = req.userDataByIdToken;
            console.log('요청 > /api/relation/info : ', userData);

            let result = await relationAdapter.getRelationInfo(userData);
            console.log('응답 > /api/relation/info : ', result);

            let response = new Response(
                200,
                '사용자-기업 연결정보 가져오기 완료',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('에러 > /api/relation/info : ', err);
            res.send(err);
        }
    });
    // 사용자 - 사용자-기업 연결 생성
    router.post('/api/relation/user/join', async (req, res) => {
        try {
            let userData = req.userDataByIdToken;
            let reqData = req.filteredData;
            console.log('요청 > GET > /api/relation/join: ', userData, reqData);
            let joinData = {
                userType: userData.userType,
                // email: userData.email,
                // email: 'mg.kim@aegisecu.com', // 테스트
                email: 'mg.sun@aegisecu.com',
                // email: 'ej.lim@aegisecu.com',
                companyId: reqData.selectCompanyId,
            };

            let result = await relationAdapter.createUserAndCompanyRelation(
                joinData
            );
            console.log('응담 > GET > /api/relation/join : ', result);

            let response = new Response(
                200,
                '사용자-기업 연결정보 생성 완료 - idToken',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('에러 > GET > /api/relation/join: ', result);
            res.send(err);
        }
    });

    // 사용자 - 소속 상태변경(취소, 해제)처리
    // 진행중인 프로젝트가 있는 경우 해제불가 : 해당 코드 프로젝트 진행 뒤 추가
    router.put('/api/relation/user/unregister', async (req, res) => {
        try {
            let userData = req.userDataByIdToken;
            let reqData = req.filteredData;
            console.log(
                '요청 > /api/relation/user/unregister : ',
                userData,
                reqData
            );

            let result = await relationAdapter.updateBelongingStatus(
                userData,
                reqData
            );
            console.log('응답 > /api/relation/user/unregister : ', result);

            let response = new Response(200, '소속 해제 완료');
            res.send(response);
        } catch (err) {
            console.log('에러 > /api/relation/user/unregister : ', err);
            res.send(err);
        }
    });

    // 업체 - 소속 상태변경(승인, 거절, 삭제)처리
    // 진행중인 프로젝트가 있는 경우 해제불가 : 해당 코드 프로젝트 진행 뒤 추가
    router.put('/api/relation/company/belonging/status', async (req, res) => {
        try {
            let userData = req.userDataByIdToken;
            let reqData = req.filteredData;
            console.log(
                '요청 > /api/relation/company/belonging/status : ',
                userData,
                reqData
            );

            let result = await relationAdapter.updateBelongingStatus(
                userData,
                reqData
            );
            console.log(
                '응답 > /api/relation/company/belonging/status : ',
                result
            );
            let belongingStatus = result['active_type'];
            let response;
            if (belongingStatus === '0') {
                response = new Response(200, '소속 해제 완료');
            } else if (belongingStatus === '2') {
                response = new Response(200, '소속요청 승인 완료');
            }
            res.send(response);
        } catch (err) {
            console.log(
                '에러 > /api/relation/company/belonging/status : ',
                err
            );
            res.send(err);
        }
    });
};
