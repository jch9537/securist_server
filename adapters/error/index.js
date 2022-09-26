module.exports = {
    DatabaseError: require('./DatabaseError'), // mysql
    ServicesError: require('./ServicesError'), // otherServer
    StorageError: require('./StorageError'), // redis
    AuthServiceError: require('./AuthServiceError'), // Cognito
    EmailServiceError: require('./EmailServiceError'), // SES
    MessageServiceError: require('./MessageServiceError'), // Solapi
    StorageServiceError: require('./StorageServiceError'), // S3
    TokenError: require('./TokenError'), // Token
};
