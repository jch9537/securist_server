// cognito token 처리 모듈
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

const processingToken = {
    // 퍼블릭키 가져오기 함수
    getPublicKeys: async () => {
        let cacheKeys;
        try {
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
        } catch (error) {
            throw error;
        }
    },
    // 토큰 복호화 함수 : 퍼블릭키와 일치여부 확인
    decodeToken: async (token) => {
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
            let claim = await verifyPromised(token, key.pem);
            return claim;
        } catch (error) {
            throw error;
        }
    },
    // access token 확인 함수
    checkAccessToken: async (token) => {
        let result;
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
            console.log(`claim confirmed for ${claim.username}`);
            result = {
                userName: claim.username,
                clientId: claim.client_id,
                isValid: true,
            };
            return result;
        } catch (error) {
            error.isValid = false;
            throw error;
        }
        // finally {
        //     return result;
        // }
    },
    // id token 으로 사용자 정보 가져오기 함수
    getUserByIdToken: async (token) => {
        try {
            const claim = await processingToken.decodeToken(token); // request > token 수정
            console.log('~~~~~~~~~~~~~~~~~~', claim);
            let result = {
                id: claim['cognito:username'],
                userType: Number(claim['custom:userType']),
                name: claim.name,
                email: claim.email,
                emailVerified: claim.email_verified,
                passwordUpdateDate: claim['custom:passwordUpdateDate'],
                authTime: claim.auth_time,
                expTime: claim.exp,
                issueTime: claim.iat,
            };
            return result;
        } catch (error) {
            throw error;
        }
    },
};

module.exports = processingToken;
