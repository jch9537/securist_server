const { profileAdapter } = require('../../../adapters/inbound');

const Response = require('../modules/Response');
const extractToken = require('../modules/extractToken');
const decryptIdToken = require('../modules/decryptIdToken');
// const decryptAccessToken = require('../modules/decryptAccessToken');
// const getUserInfoByAccessToken = require('../modules/getUserInfoByAccessToken');

module.exports = (router) => {
    router.use(extractToken);
    router.use(decryptIdToken);
    // 사용자 - 프로필 임시정보 생성 : 임시저장
    router.post('/api/profile/user/temp', async (req, res) => {
        try {
            let userData = req.userDataByIdToken;
            let reqData = req.filteredData;
            console.log(
                'POST - /api/profile/user/temp 요청 : ',
                userData,
                reqData
            );

            let result = await profileAdapter.createProfileTemp(
                userData,
                reqData
            );
            console.log('POST - /api/profile/user/temp 응답 : ', result);

            let response = new Response(
                200,
                '사용자 정보가져오기 완료 - idToken',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('/api/profile/user/temp 에러 응답 : ', result);
            res.send(err);
        }
    });
    // 프로필 임시정보 가져오기 : 임시저장 데이터 가져오기
    router.get('/api/profile/temp/:userId', async (req, res) => {
        try {
            let userData = req.userDataByIdToken;
            console.log(
                'GET - /api/profile/temp/:userId 요청 : ',
                userData,
                reqData
            );

            let result = await profileAdapter.getProfileTemp(userData);
            console.log('GET - /api/profile/temp/:userId 응답 : ', result);

            let response = new Response(
                200,
                '사용자 정보가져오기 완료 - idToken',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('/api/profile/temp/:userId 에러 응답 : ', result);
            res.send(err);
        }
    });
    // // 프로필 정보가져오기
    // router.get('/api/profile/:userId', async (req, res) => {
    //     try {
    //         let userData = req.userDataByIdToken;
    //         console.log('GET - /api/profile/:userId 요청 : ', userData);

    //         let result = await userAdapter.getProfile(userData);
    //         console.log('GET - /api/profile/:userId 응답 : ', result);

    //         let response = new Response(
    //             200,
    //             '사용자 정보가져오기 완료 - idToken',
    //             result
    //         );
    //         res.send(response);
    //     } catch (err) {
    //         console.log('/api/profile/:userId 에러 응답 : ', result);
    //         res.send(err);
    //     }
    // });
};
