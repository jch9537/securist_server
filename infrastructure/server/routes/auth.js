const { authAdaptor } = require('../../../adapters/inbound');

module.exports = (router) => {
    router.post('/signUp', (req, res) => {});
    router.post('/logIn', (req, res) => {});
    router.post('/signOut', (req, res) => {});
    router.post('/checkDuplicateEmail', (req, res) => {
        let email = req.body.email;
        let response = authAdaptor.checkDuplicateEmail(email);
        response.then((message) => {
            console.log('응답 : ', message);
            res.send(message);
        });
    });
};
