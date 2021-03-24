const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');

const region = process.env.AWS_REGION || '';
const cognitoPoolId = process.env.AWS_COGNITO_USERPOOL_ID || '';

if (!cognitoPoolId) {
    throw new Error('env var required for cognito pool');
}
const cognitoIssuer = `https://cognito-idp.${region}.amazonaws.com/${cognitoPoolId}`;

const verifyPromised = promisify(jwt.verify.bind(jwt));

// 토큰 복호화
// adapter가기 전 access token 복호화, 만료기간 확인
// adapter가기 전 id 토큰 복호화 > userdata 전달

const processingToken = {
    extractToken: (request) => {
        const reqHeader = request.headers.authorization;
        if (!reqHeader) throw 'Request Header is undefined';
        const token = reqHeader.split(' ')[1];
        return token;
    },
    getPublicKeys: async () => {
        let cacheKeys;
        if (!cacheKeys) {
            const url = `${cognitoIssuer}/.well-known/jwks.json`;
            const publicKeys = await axios.default.get(url);
            cacheKeys = publicKeys.data.keys.reduce((agg, current) => {
                const pem = jwkToPem(current);
                agg[current.kid] = { instance: current, pem };
                return agg;
            }, {});
            return cacheKeys;
        } else {
            return cacheKeys;
        }
    },
    decodeToken: async (token) => {
        // const token = processingToken.extractToken(request);
        let claim;
        try {
            const tokenSections = (token || '').split('.');
            if (tokenSections.length < 2) {
                throw new Error('requested token is invalid');
            }
            const headerJSON = Buffer.from(tokenSections[0], 'base64').toString(
                'utf8'
            );
            const header = JSON.parse(headerJSON);
            const keys = await processingToken.getPublicKeys();
            const key = keys[header.kid];
            if (key === undefined) {
                throw new Error('claim made for unknown kid');
            }
            claim = await verifyPromised(token, key.pem);
        } catch (error) {
            claim = error;
        }
        return claim;
    },
    checkAccessToken: async (request) => {
        let result;
        const token = processingToken.extractToken(request); //추가
        try {
            const claim = await processingToken.decodeToken(token); // request > token 수정
            const currentSeconds = Math.floor(new Date().valueOf() / 1000);
            if (
                currentSeconds > claim.exp ||
                currentSeconds < claim.auth_time
            ) {
                throw new Error('claim is expired or invalid');
            }
            if (claim.iss !== cognitoIssuer) {
                throw new Error('claim issuer is invalid');
            }
            if (claim.token_use !== 'access') {
                throw new Error('claim use is not access');
            }
            // console.log(`claim confirmed for ${claim.username}`);
            result = {
                userName: claim.username,
                clientId: claim.client_id,
                isValid: true,
            };
        } catch (error) {
            result = { userName: '', clientId: '', error, isValid: false };
        }
        return result;
    },
    getUserByIdToken: async (request) => {
        let result;
        const token = processingToken.extractToken(request); //추가
        try {
            const claim = await processingToken.decodeToken(token); // request > token 수정
            result = {
                id: claim['cognito:username'],
                userType: claim['custom:userType'],
                name: claim.name,
                email: claim.email,
                emailVerified: claim.email_verified,
                passwordUpdatedAt: claim['custom:passwordUpdatedAt'],
                authTime: claim.auth_time,
                expTime: claim.exp,
                issueTime: claim.iat,
            };
        } catch (error) {
            result = error;
        }
        return result;
    },
};

module.exports = processingToken;

// let cacheKeys; // MapOfKidToPublicKey | undefined;
// const getPublicKeys = async () => {
//     //: Promise<MapOfKidToPublicKey>
//     if (!cacheKeys) {
//         const url = `${cognitoIssuer}/.well-known/jwks.json`;
//         const publicKeys = await axios.default.get(url); //<PublicKeys>
//         cacheKeys = publicKeys.data.keys.reduce((agg, current) => {
//             const pem = jwkToPem(current);
//             agg[current.kid] = { instance: current, pem };
//             return agg;
//         }, {}); //{} as MapOfKidToPublicKey
//         return cacheKeys;
//     } else {
//         return cacheKeys;
//     }
// };

// decodeToken: async (token) => {
//: Promise<ClaimVerifyResult>
//     let result;
//     try {
//         console.log(
//             `user claim verify invoked for ${JSON.stringify(request)}`
//         );
//         const token = request;
//         const tokenSections = (token || '').split('.');
//         if (tokenSections.length < 2) {
//             throw new Error('requested token is invalid');
//         }
//         const headerJSON = Buffer.from(tokenSections[0], 'base64').toString(
//             'utf8'
//         );
//         const header = JSON.parse(headerJSON); // as TokenHeader;
//         const keys = await getPublicKeys();
//         const key = keys[header.kid];
//         if (key === undefined) {
//             throw new Error('claim made for unknown kid');
//         }
//         const claim = await verifyPromised(token, key.pem); // as Claim;
//         const currentSeconds = Math.floor(new Date().valueOf() / 1000);
//         if (
//             currentSeconds > claim.exp ||
//             currentSeconds < claim.auth_time
//         ) {
//             throw new Error('claim is expired or invalid');
//         }
//         if (claim.iss !== cognitoIssuer) {
//             throw new Error('claim issuer is invalid');
//         }
//         if (claim.token_use !== 'access') {
//             throw new Error('claim use is not access');
//         }
//         console.log(`claim confirmed for ${claim.username}`);
//         result = {
//             userName: claim.username,
//             clientId: claim.client_id,
//             isValid: true,
//         };
//     } catch (error) {
//         result = { userName: '', clientId: '', error, isValid: false };
//     }
//     return result;
// },
