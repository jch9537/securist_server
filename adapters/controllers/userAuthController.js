const { Auth, Repository, SendMail } = require('../outbound');
const {
    SignUp,
    CreateUser,
    GetUser,
    UserEntity,
    DeleteUserByAdmin,
} = require('../../domain/user');

module.exports = {
    async signUp(req, res) {
        console.log(
            '요청 > Adapter > Controller > userAuthController.js >  signUp - req.body : ',
            req.body
        );
        try {
            let validData = new UserEntity(req.body);
            let handler = new SignUp(Auth);
            let result = await handler.excute(validData);
            console.log(
                '응답 > Adapter > Controller > userAuthController.js >  signUp - res : ',
                result
            );
            res.send({
                status: 201,
                message: 'signUp Success!!',
                data: result.User,
            });
        } catch (err) {
            console.log(
                '에러 응답 > Adapter > Controller > userAuthController.js >  signUp - err : ',
                err
            );
            if (err.code === 'UsernameExistsException') {
                res.send({
                    err: {
                        message: '이미 가입되어있는 사용자 입니다.',
                        status: 409,
                    },
                });
            } else {
                res.send('createUser failed!!');
            }
        }
    },

    async createUser(req, res) {
        console.log(
            '요청 > Adapter > Controller > userAuthController.js >  createUser - req.body : ',
            req.body
        );
        try {
            let validData = new UserEntity(req.body);
            let handler = new CreateUser(Auth);
            let result = await handler.excute(validData);
            console.log(
                '응답 > Adapter > Controller > userAuthController.js >  createUser - res : ',
                result
            );
            res.send({
                status: 201,
                message: 'createUser Success!!',
                data: result.User,
            });
        } catch (err) {
            console.log(
                '에러 응답 > Adapter > Controller > userAuthController.js >  createUser - err : ',
                err
            );
            if (err.code === 'UsernameExistsException') {
                res.send({
                    message: '이미 가입되어있는 사용자 입니다.',
                    status: 409,
                });
            } else {
                res.send('createUser failed!!');
            }
        }
    },

    async verifyDuplicateEmail(req, res) {
        console.log(
            '요청 > Adapter > Controller > userAuthController.js >  verifyDuplicateEmail - req.query.email : ',
            req.query.email
        );
        try {
            let result = await Auth.confirmUser(req.query.email);
            if (result.Users.length === 0) {
                res.send({ message: '사용 가능한 email입니다.', status: 200 });
            } else
                res.send({ message: '이미 가입된 email입니다.', status: 409 });
        } catch (err) {
            console.log(
                '응답 > Adapter > Controller > userAuthController.js >  verifyDuplicateEmail - res.err : ',
                err
            );
            res.send({ message: err.message, status: 400 });
        }
    },

    async deleteUserByAdmin(req, res) {
        console.log(
            '요청 > Adapter > Controller > userAuthController.js >  DeleteUserByAdmin - req.body : ',
            req.body
        );
        try {
            let validData = new UserEntity(req.body);
            let handler = new DeleteUserByAdmin(Auth);
            let result = await handler.excute(validData);
            console.log(
                '응답 > Adapter > Controller > userAuthController.js >  DeleteUserByAdmin - res : ',
                Object.keys(result).length
            );
            if (Object.keys(result).length === 0) {
                res.send({ message: '사용자 삭제 성공', status: 204 });
            }
        } catch (err) {
            console.log(
                '에러 응답 > Adapter > Controller > userAuthController.js >  DeleteUserByAdmin - error : ',
                err
            );
            res.send({
                status: 406,
                message: 'User to delete does not exist!! ',
            });
        }
    },
};
