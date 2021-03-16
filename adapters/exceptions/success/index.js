const EnabledUser = require('./EnabledUser');
const SignUpSuccess = require('./SignUpSuccess');
const LogInSuccess = require('./LogInSuccess');
const LogOutSuccess = require('./LogOutSuccess');

module.exports = {
    enabledUser(state) {
        return new EnabledUser(state);
    },
    signUpSucess(data) {
        return new SignUpSuccess(data);
    },
    logInSucess(data) {
        return new LogInSuccess(data);
    },
    logOutSuccess(data) {
        return new LogOutSuccess();
    },
};
// userNotExist: {
//     status: 404,
//     message: '존재하지 않는 email입니다.(Not Found)',
// },
