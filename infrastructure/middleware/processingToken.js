//TODO 토큰 디코드 중복코드 정리
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');
const { error } = require('console');

const region = process.env.AWS_REGION || '';
const cognitoPoolId = process.env.AWS_COGNITO_USERPOOL_ID || '';

if (!cognitoPoolId) {
    throw new Error('env var required for cognito pool');
}
const cognitoIssuer = `https://cognito-idp.${region}.amazonaws.com/${cognitoPoolId}`;

let cacheKeys; // MapOfKidToPublicKey | undefined;
const getPublicKeys = async () => {
    //: Promise<MapOfKidToPublicKey>
    if (!cacheKeys) {
        const url = `${cognitoIssuer}/.well-known/jwks.json`;
        const publicKeys = await axios.default.get(url); //<PublicKeys>
        cacheKeys = publicKeys.data.keys.reduce((agg, current) => {
            const pem = jwkToPem(current);
            agg[current.kid] = { instance: current, pem };
            return agg;
        }, {}); //{} as MapOfKidToPublicKey
        return cacheKeys;
    } else {
        return cacheKeys;
    }
};

const verifyPromised = promisify(jwt.verify.bind(jwt));

module.exports = {
    confirmToken: async (token) => {
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
        let result;
        try {
            const tokenSections = (token || '').split('.');
            if (tokenSections.length < 2) {
                throw new Error('requested token is invalid');
            }
            const headerJSON = Buffer.from(tokenSections[0], 'base64').toString(
                'utf8'
            );
            const header = JSON.parse(headerJSON); // as TokenHeader;
            const keys = await getPublicKeys();
            const key = keys[header.kid];
            if (key === undefined) {
                throw new Error('claim made for unknown kid');
            }
            const claim = await verifyPromised(token, key.pem); // as Claim;
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
        } catch (error) {
            result = { userName: '', clientId: '', error, isValid: false };
        }
        return result;
    },
    getUserInfoByToken: async (token) => {
        let result;
        try {
            const tokenSections = (token || '').split('.');
            if (tokenSections.length < 2) {
                throw new Error('requested token is invalid');
            }
            const headerJSON = Buffer.from(tokenSections[0], 'base64').toString(
                'utf8'
            );
            const header = JSON.parse(headerJSON); // as TokenHeader;
            const keys = await getPublicKeys();
            const key = keys[header.kid];
            if (key === undefined) {
                throw new Error('claim made for unknown kid');
            }
            const claim = await verifyPromised(token, key.pem); // as Claim;
            console.log('클레임 : ', claim);
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
            if (claim.token_use !== 'id') {
                throw new Error('claim use is not id');
            }
            console.log(`claim confirmed for ${claim.username}`);
            result = claim;
        } catch (error) {
            result = { userName: '', clientId: '', error, isValid: false };
        }
        return result;
    },
};
