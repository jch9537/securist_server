const { Auth, Repository, SendMail } = require('../outbound');

module.exports = {
    async verifyDuplicateEmail(req, res) {
        console.log(
            '요청 > Adapter > Controller > userController.js >  getUserByEmail - req.query.email : ',
            req.query.email
        );
        try {
            let result = await Auth.confirmUser(req.query.email);
            if (result.Users.length === 0) {
                res.send({ message: '사용가능한 email 입니다.' });
            } else res.send({ message: '이미 가입된 email 입니다.' });
        } catch (error) {
            console.log(
                '응답 > Adapter > Controller > userController.js >  getUserByEmail - res.error : ',
                error
            );
            res.send({ error: error.message });
        }
    },
};
