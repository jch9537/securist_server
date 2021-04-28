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
    // 사용자 - 사용자-기업 연결 생성 : 사용자가 기업소속 요청 시
    router.get('/api/relation/user/join/:companyId', async (req, res) => {
        try {
            let userData = req.userDataByIdToken;
            let companyId = req.params.companyId;
            console.log(
                '요청 > GET > /api/relation/join: ',
                userData,
                companyId
            );
            let joinData = {
                userType: userData.userType,
                email: userData.email,
                // email: 'gs.park@aegisecu.com', // 테스트
                companyId: companyId,
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
    // 사용자-기업 연결정보 가져오기
    router.get('/api/relation/info', decryptIdToken, async (req, res) => {
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
    // 사용자 소속기업 정보 가져오기
    router.get(
        '/api/relation/belonging/company/info',
        decryptIdToken,
        async (req, res) => {
            try {
                let userData = req.userDataByIdToken;
                console.log(
                    '요청 > /api/relation/belonging/company/info : ',
                    userData
                );

                let result = await relationAdapter.getUserBelongingCompanyInfo(
                    userData
                );
                console.log(
                    '응답 > /api/relation/belonging/company/info : ',
                    result
                );

                let response = new Response(
                    200,
                    '사용자 소속 기업정보 가져오기 완료',
                    result
                );
                res.send(response);
            } catch (err) {
                console.log(
                    '에러 > /api/relation/belonging/company/info : ',
                    err
                );
                res.send(err);
            }
        }
    );
    // 업체 - 소속 승인 : 사용자-기업 is_active 상태 승인처리
    // router.put('/api/relation/company/permit/:userId')

    // 사용자 - 사용자-기업 연결 삭제 : 사용자가 소속요청 취소/해제하기 처리 시
    router.delete('/api/relation/user/release/:companyId', async (req, res) => {
        try {
            let userData = req.userDataByIdToken;
            let companyId = req.params.companyId;
            console.log(
                '요청 > DELELTE > /api/relation/join: ',
                userData,
                companyId
            );
            let releaseData = {
                userType: userData.userType,
                email: userData.email,
                // email: 'yh.jo@aegisecu.com', // 테스트
                companyId: companyId,
            };

            let result = await relationAdapter.deleteRelationByUser(
                releaseData
            );
            console.log('응담 > DELELTE > /api/relation/join : ', result);

            let response = new Response(
                200,
                '사용자-기업 연결정보 삭제 완료 - idToken',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('에러 > DELELTE > /api/relation/join: ', result);
            res.send(err);
        }
    });
    // 업체 - 사용자-기업 연결 삭제 : 소속요청 거절
    router.delete('/api/relation/company/refuse/:userId', async (req, res) => {
        try {
            let userData = req.userDataByIdToken;
            let userId = req.params.userId;
            console.log(
                '요청 > DELELTE >/api/relation/company/refuse/:userId ',
                userData,
                userId
            );

            let result = await relationAdapter.deleteRelationByCompany(
                userData,
                userId
            );
            console.log(
                '응담 > DELELTE > /api/relation/company/refuse/:userId : ',
                result
            );

            let response = new Response(
                200,
                '사용자-기업 연결정보 삭제 완료 - idToken',
                result
            );
            res.send(response);
        } catch (err) {
            console.log(
                '에러 > DELELTE > /api/relation/company/refuse/:userId : ',
                result
            );
            res.send(err);
        }
    });
};
