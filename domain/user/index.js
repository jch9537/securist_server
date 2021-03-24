module.exports = {
    UserEntity: require('./entity/UserEntity'),
    CheckDuplicateEmail: require('./useCases/FindUserByEmail'),
    SignUp: require('./useCases/SignUp'),
    LogIn: require('./useCases/LogIn'),
    LogOut: require('./useCases/LogOut'),
    FindUserByEmail: require('./useCases/FindUserByEmail'),
    ForgotPassword: require('./useCases/ForgotPassword'),
    ChangePassword: require('./useCases/ChangePassword'),
    ConfirmForgotPassword: require('./useCases/ConfirmForgotPassword'),
    IssueNewToken: require('./useCases/IssueNewToken'),
};
