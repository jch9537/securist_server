/*
확인사항 : 소속 될 기업 검색 시 : 기업리스트 가져오기 1, 2, 3번중 선택 : 1,2번 혼합으로 진행함
1. 기업의 정보(기업명, 대표자명, 소속컨설턴트 수)를 DB에서 가져온 후 클라이언트에서 onChange에 따라 필터링
2. 기업의 이름만 가져온 후 select에서 선택 시 기업의 이름으로 필터링해서 DB검색 후 가져오기 
3. onChange마다 DB에서 업체명 검색해서 가져오기 - 리소스 많이 들 것 같음
*/
const {
    authAdapter,
    userAdapter,
    companyAdapter,
} = require('../../../adapters/inbound');

const Response = require('../modules/Response');
const extractToken = require('../modules/extractToken');
const decryptIdToken = require('../modules/decryptIdToken');

module.exports = (router) => {
    router.use(extractToken);
    router.use(decryptIdToken);

    // 기업정보 가져오기
    router.get('/api/company/:companyId', async (req, res) => {
        try {
            let userData = req.userDataByIdToken;
            let companyId = req.params.companyId;
            console.log(
                '요청 > /api/company/:companyId : ',
                userData,
                companyId
            );

            let result = await companyAdapter.getCompanyInfo(
                userData,
                companyId
            );
            console.log('응답 > /api/company/:companyId : ', result);

            let response = new Response(200, '기업정보 가져오기 완료', result);
            res.send(response);
        } catch (err) {
            console.log('에러 > /api/company/:companyId : ', err);
            res.send(err);
        }
    });
    // 등록된 기업정보 가져오기 : 업체 검색
    router.get('/api/company/list', async (req, res) => {
        try {
            let userData = req.userDataByIdToken;

            let result = await companyAdapter.getCompanyList(userData);
            console.log('GET - /api/company/list 응답 : ', result);

            let response = new Response(
                200,
                '기업리스트 가져오기 완료',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('/api/company/list 에러응답 : ', err);
            res.send(err);
        }
    });
    //선택 기업 컨설턴트 수 가져오기
    router.get('/api/company/usercount', async (req, res) => {
        try {
            let userData = req.userDataByIdToken;
            let companyId = req.filteredQuery.id;
            console.log('요청 데이터 : ', userData, companyId);

            let result = await companyAdapter.getCompanyUserCount(
                userData,
                companyId
            );
            console.log('GET - /api/company 응답 : ', result);

            let response = new Response(
                200,
                '소속 컨설턴트수 가져오기',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('/api/company 에러응답 : ', err);
            res.send(err);
        }
    });

    // 사용자 소속요청에 대한 응답 (승인/거부)
    router.put(
        '/api/company/permit/member',
        decryptIdToken,
        async (req, res) => {
            try {
                let userData = req.userDataByIdToken;
                let reqData = req.filteredData;
                console.log(
                    'PUT > 요청 >  /api/company/permit/member  : ',
                    userData,
                    reqData
                );

                let result = await companyAdapter.updateRegistrationStatus(
                    userData,
                    reqData
                );
                console.log(
                    'PUT > 응답 > /api/company/permit/member  : ',
                    result
                );

                let response = new Response(
                    200,
                    '컨설턴트 소속요청 처리 완료',
                    result
                );
                res.send(response);
            } catch (err) {
                console.log('PUT > 에러 > /api/company/permit/member  : ', err);
                res.send(err);
            }
        }
    );
};
