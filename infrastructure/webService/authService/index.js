const Cognito = require('./Cognito');

module.exports = {
    authService: new Cognito(),
    processingToken: require('./processingToken'),
};
