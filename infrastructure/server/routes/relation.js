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
    router.post('/api/relation/user/join', async (req, res) => {
        try {
            let userData = req.userDataByIdToken;
            let reqData = req.filteredData;
            console.log('요청 > GET > /api/relation/join: ', userData, reqData);
            let joinData = {
                userType: userData.userType,
                email: userData.email,
                // email: 'mg.kim@aegisecu.com', // 테스트
                // email: 'mg.sun@aegisecu.com',
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

    // 업체 - 소속 상태변경(승인, 거절, 삭제)처리
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

            let response = new Response(200, '소속상태 변경 완료', result);
            res.send(response);
        } catch (err) {
            console.log(
                '에러 > /api/relation/company/belonging/status : ',
                err
            );
            res.send(err);
        }
    });

    // 사용자 - 사용자-기업 연결 삭제 : 사용자가 소속요청 취소/해제하기 처리 시
    router.delete('/api/relation/user/release/:companyId', async (req, res) => {
        try {
            let userData = req.userDataByIdToken;
            let companyId = req.params.companyId;
            console.log(
                '요청 > DELELTE > /api/relation/user/release/:companyId: ',
                userData,
                companyId
            );
            let deleteData = {
                userType: userData.userType,
                email: userData.email,
                // email: 'ej.lim@aegisecu.com', // 테스트
                companyId: companyId,
            };

            let result = await relationAdapter.deleteRelationByUser(deleteData);
            console.log(
                '응답 > DELELTE > /api/relation/user/release/:companyId : ',
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
                '에러 > DELELTE > /api/relation/user/release/:companyId: ',
                result
            );
            res.send(err);
        }
    });
    // 업체 - 사용자-기업 연결 삭제 : 소속요청 거절
    router.delete(
        '/api/relation/company/refuse/:selectUserId',
        async (req, res) => {
            try {
                let userData = req.userDataByIdToken;
                let selectUserId = req.params.selectUserId;
                console.log(
                    '요청 > DELELTE >/api/relation/company/refuse/:selectUserId ',
                    userData,
                    selectUserId
                );

                let result = await relationAdapter.deleteRelationByCompany(
                    userData,
                    selectUserId
                );
                console.log(
                    '응담 > DELELTE > /api/relation/company/refuse/:selectUserId : ',
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
                    '에러 > DELELTE > /api/relation/company/refuse/:selectUserId : ',
                    result
                );
                res.send(err);
            }
        }
    );
};
