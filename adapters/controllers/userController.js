// 메서드 정의 인터페이스 - 컨트롤러
const { UserEntity, CreateUser, GetUser } = require('../../domain/user');
const { Auth, Repository, SendMail } = require('../outbound');

module.exports = {
    async createUser(req, res) {
        console.log(
            'Adapter > Controller > userController.js - req.body : ',
            req.body
        );

        let validData = new UserEntity(req.body); // 요청 정보의 유효성검사
        let handler = new CreateUser(Auth); // 비즈니스 로직에 인증 outbound(AWS Cognito) 연결
        let result = await handler.excute(validData); // Cognito 사용자 풀 인증

        console.log(
            'Adapter > Controller > userController.js - result : ',
            result
        );
        res.send({ createUser: result });
    },
    async getUser(req, res) {
        // console.log('userController: getUser!!', req.body);
        // let inputData = new UserEntity(req.body);
        // let handler = new GetUser(Auth);
        // let result = handler.excute(inputData);
        // res.send('getUser!!', result);
    },
    updateUser(req, res) {
        res.send('updateUser!!');
    },
    deleteUser(req, res) {
        res.send('deleteUser!!');
    },
    confirmUser(req, res) {
        console.log(
            'Adapter > Controller > userController.js - req.query.email : ',
            req.query.email
        );
        let result = Auth.confirmUser(req.query.email);
        res.send({ confirmUser: result });
    },
};
