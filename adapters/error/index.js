module.exports = {
    DatabaseError: require('./DatabaseError'),
    // UpdatedDatabaseError: require('./UpdatedDatabaseError'),// 추후 Database에러를 UpdatedDatabaseError로 교체
    ServiceAuthenticationError: require('./ServiceAuthenticationError'),
    AuthServiceError: require('./AuthServiceError'),
    EmailServiceError: require('./EmailServiceError'),
    MessageServiceError: require('./MessageServiceError'),
    StorageServiceError: require('./StorageServiceError'),
    TokenError: require('./TokenError'),
    // MiddlewareError: require('./MiddelwareError'),
    // CognitoError: require('./CognitoError'),
};
