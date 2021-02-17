// 메서드 라우터 - 사용자
const { userController } = require('../../../adapters/controllers');

module.exports = (router) => {
    router.get('/user/:id', (req, res) => {
        console.log(
            '------------------ test start > GET /user/:id : ---------------------------------------'
        );
        userController.getUser(req, res);
    }); // 해당 id 사용자 정보가져오기

    router.post('/user/:id', (req, res) => {
        console.log(
            '------------------ test start : PUT /user/:user_type ---------------------------------------'
        );
        userController.createUser(req, res);
    }); // 회원가입 후 추가정보 입력

    router.put('/user/:id', (req, res) => userController.updateUser(req, res)); // 사용자 정보 변경

    router.delete(
        '/user/:id',
        (req, res) => userController.deleteUser(req, res) // 회원 탈퇴
    );
};
