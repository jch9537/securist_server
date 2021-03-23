module.exports = {
    extractToken: (request) => {
        let reqHeader = request.headers.authorization;
        console.log('----------------------', reqHeader);
        if (!reqHeader) throw 'Request Header is undefined';
        let token = reqHeader.split(' ')[1];
        return token;
    },
};
