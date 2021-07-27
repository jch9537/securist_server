const { companyAdapter } = require('../../../adapters/inbound');
const Response = require('../modules/Response');
const extractToken = require('../modules/extractToken');
const decryptIdToken = require('../modules/decryptIdToken');

module.exports = (router) => {
    router.use(extractToken);
    router.use(decryptIdToken);

    // 기업정보 가져오기
    router.get('/api/company/:companyId/info', async (req, res) => {
        let result, response;
        try {
            let userData = req.userDataByIdToken;
            let reqParamsData = req.params;
            console.log(
                '요청 > /api/company/:companyId/info : ',
                userData,
                reqParamsData
            );

            result = await companyAdapter.getCompanyInfo(
                userData,
                reqParamsData
            );
            console.log('응답 > /api/company/:companyId/info : ', result);

            response = new Response(200, '기업정보 가져오기 완료', result);
            res.send(response);
        } catch (err) {
            console.log('에러 > /api/company/:companyId/info : ', err);
            res.send(err);
        }
    });
    // 등록된 기업들 가져오기 : 업체 검색   - 등록된 기업만 필터링
    router.get('/api/company/list/registration', async (req, res) => {
        let result, response;
        try {
            let userData = req.userDataByIdToken;

            result = await companyAdapter.getCompanyList(userData);
            console.log('GET - /api/company/list/registration 응답 : ', result);

            response = new Response(200, '기업리스트 가져오기 완료', result);
            res.send(response);
        } catch (err) {
            console.log('/api/company/list/registration 에러응답 : ', err);
            res.send(err);
        }
    });
    //선택 기업 소속 컨설턴트들 정보 가져오기
    router.get(
        '/api/company/:companyId/belonging/users/info',
        async (req, res) => {
            let result, response;
            try {
                let userData = req.userDataByIdToken;
                let reqParamsData = req.params;
                console.log('요청 데이터 : ', userData, reqParamsData);

                result = await companyAdapter.getCompanyBelongedUsersInfo(
                    userData,
                    reqParamsData
                );
                console.log(
                    '응답 > GET > /api/company/belonging/users/info : ',
                    result
                );

                response = new Response(
                    200,
                    '소속 컨설턴트들 정보가져오기 완료',
                    result
                );
                res.send(response);
            } catch (err) {
                console.log(
                    '에러 > GET > /api/company/belonging/users/info : ',
                    err
                );
                res.send(err);
            }
        }
    );
    // 업체 - 소속 상태변경(승인, 거절, 삭제)처리 ----------권한필요!!(해당기업 소속의 관리자 권한)
    // 진행중인 프로젝트가 있는 경우 해제불가 : 해당 코드 프로젝트 진행 뒤 추가
    router.put('/api/company/relation/status', async (req, res) => {
        let result, response;
        try {
            let userData = req.userDataByIdToken;
            let reqBodyData = req.filteredBody;
            console.log(
                '요청 > /api/company/relation/status : ',
                userData,
                reqData
            );

            result = await companyAdapter.updateRegistrationStatus(
                userData,
                reqData
            );
            console.log('응답 > /api/company/relation/status : ', result);
            let belongingType = result['belonging_type'];
            console.log('--------------------', belongingType);

            if (belongingType === 0) {
                response = new Response(200, '소속 해제 완료');
            } else if (belongingType === 2) {
                response = new Response(200, '소속 요청 승인 완료');
            } else {
                response = new Response(400, '소속 타입 에러 ');
                throw response;
            }
            res.send(response);
        } catch (err) {
            console.log('에러 > /api/company/relation/status : ', err);
            res.send(err);
        }
    });
};
