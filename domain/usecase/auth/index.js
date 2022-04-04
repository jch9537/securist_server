module.exports = {
    CheckDuplicateEmail: require('./CheckDuplicateEmail'),
    ResendComfirmEmail: require('./ResendComfirmEmail'),
    SignUp: require('./SignUp'),
    LogIn: require('./LogIn'),
    LogOut: require('./LogOut'),
    ForgotPassword: require('./ForgotPassword'),
    ChangePassword: require('./ChangePassword'),
    ConfirmForgotPassword: require('./ConfirmForgotPassword'),
    // CheckAccessToken: require('./CheckAccessToken'), // 미들웨어 처리
    IssueNewToken: require('./IssueNewToken'),
    VerifyUserByPassword: require('./VerifyUserByPassword'),
};
