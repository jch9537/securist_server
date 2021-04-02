// TODO - setter, getter 따로 만들기, validation
'use strict';

const {
    validateBusinessLicenseNum,
    validateClientName,
    validatePresidentName,
    // validateClientApprovalState,
    // validateSignature,
    // validateClientDocFile,
    // validateCreatedAt,
    // validateDeletedAt,
} = require('./utils/validateUserInfo');

module.exports = class {
    constructor({
        clientId = null,
        businessLicenseNum,
        clientName,
        presidentName,
        // clientApprovalState,
        // signature,
        // clientDocFile,
        // createdAt,
        // deletedAt,
    }) {
        this.clientId = null;
        this.businessLicenseNum = businessLicenseNum;
        this.clientName = clientName;
        this.presidentName = presidentName;
        // this.clientApprovalState = clientApprovalState;
        // this.signature = signature;
        // this.clientDocFile = clientDocFile;
        // this.createdAt = createdAt;
        // this.deletedAt = deletedAt;
    }

    // businessLicenseNum
    get businessLicenseNum() {
        return this._businessLicenseNum;
    }
    set businessLicenseNum(businessLicenseNum) {
        if (validateBusinessLicenseNum(businessLicenseNum)) {
            this._businessLicenseNum = businessLicenseNum;
        } else {
            this._businessLicenseNum = '에러';
            // throw exceptions;
        }
    }
    // clientName
    get clientName() {
        return this._clientName;
    }
    set clientName(clientName) {
        if (validateClientName(clientName)) {
            this._clientName = clientName;
        } else {
            this._clientName = '에러';
            // throw exceptions
        }
    }
    // presidentName
    get presidentName() {
        return this._presidentName;
    }
    set presidentName(presidentName) {
        if (validatePresidentName(presidentName)) {
            this._presidentName = presidentName;
        } else {
            this._presidentName = '에러';
            // throw exceptions
        }
    }
    // // clientApprovalState
    // get clientApprovalState() {
    //     return this._clientApprovalState;
    // }
    // set clientApprovalState(clientApprovalState) {
    //     if (validateClientApprovalState(clientApprovalState)) {
    //         this._clientApprovalState = clientApprovalState;
    //     } else {
    //         this._clientApprovalState = '에러';
    //         // throw exceptions
    //     }
    // }
    // // signature
    // get signature() {
    //     return this._signature;
    // }
    // set signature(signature) {
    //     if (validateSignature(signature)) {
    //         this._signature = signature;
    //     } else {
    //         this._signature = '에러';
    //         // throw exceptions
    //     }
    // }
    // // clientDocFile
    // get clientDocFile() {
    //     return this._clientDocFile;
    // }
    // set clientDocFile(clientDocFile) {
    //     if (validateClientDocFile(clientDocFile)) {
    //         this._clientDocFile = clientDocFile;
    //     } else {
    //         this._clientDocFile = '에러';
    //         // throw exceptions
    //     }
    // }
    // // createdAt
    // get createdAt() {
    //     return this._createdAt;
    // }
    // set createdAt(createdAt) {
    //     if (validateCreatedAt(createdAt)) {
    //         this._createdAt = createdAt;
    //     } else {
    //         this._createdAt = '에러';
    //         // throw exceptions
    //     }
    // }
    // // deletedAt
    // get deletedAt() {
    //     return this._deletedAt;
    // }
    // set deletedAt(deletedAt) {
    //     if (validateDeletedAt(deletedAt)) {
    //         this._deletedAt = deletedAt;
    //     } else {
    //         this._deletedAt = '에러';
    //         // throw exceptions
    //     }
    // }
};
