module.exports = {
    CheckDuplicateEmail: require('./FindUserByEmail'),
    SignUp: require('./SignUp'),
    LogIn: require('./LogIn'),
    LogOut: require('./LogOut'),
    FindUserByEmail: require('./FindUserByEmail'),
    ForgotPassword: require('./ForgotPassword'),
    ChangePassword: require('./ChangePassword'),
    ConfirmForgotPassword: require('./ConfirmForgotPassword'),
    CheckAccessToken: require('./CheckAccessToken'),
    IssueNewToken: require('./IssueNewToken'),
};
