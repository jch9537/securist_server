module.exports = {
    CreateUser: require('./useCases').CreateUser,
    GetUser: require('./useCases').GetUser,
    DeleteUserByAdmin: require('./useCases').DeleteUserByAdmin,
    SignUp: require('./useCases').SignUp,
    UserEntity: require('./entity/userEntity'),
};
