const LogInSuccess = require('./LoginSuccess');
const GetUserByEmailSuccess = require('./GetUserByEmailSuccess');
const SignUpSuccess = require('./SignUpSuccess');
const LogOutSuccess = require('./LogOutSuccess');

// const DisabledUser = require('./DisabledUser');

// const InvalidPassword = require('./InvalidPassword');
// const InvalidParameter = require('./InvalidParameter');
// const AccessTokenExpired = require('./AccessTokenExpired');
// const InvalidAccessToken = require('./InvalidAccessToken');
// const ExceededLogInCount = require('./ExceededLogInCount');

module.exports = {
    logInSuccess: (data) => {
        return new LogInSuccess(data);
    },
    getUserByEmailSuccess: (data) => {
        return new GetUserByEmailSuccess(data);
    },
    signUpSuccess(data) {
        return new SignUpSuccess(data);
    },
    logOutSuccess(data) {
        return new LogOutSuccess(data);
    },
    // confirmAuthMail(err) {
    //     return new ConfirmAuthMail(err);
    // },
    // disabledUser(err) {
    //     return new DisabledUser(err);
    // },
    // invalidPassword(err) {
    //     return new InvalidPassword(err);
    // },
    // invalidParameter(err) {
    //     return new InvalidParameter(err);
    // },
    // accessTokenExpired(err) {
    //     return new AccessTokenExpired(err);
    // },
    // invalidAccessToken(err) {
    //     return new InvalidAccessToken(err);
    // },
    // exceededLogInCount(err) {
    //     return new ExceededLogInCount(err);
    // },
};
