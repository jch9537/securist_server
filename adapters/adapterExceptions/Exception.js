module.exports = class {
    constructor(
        message = 'ID 토큰 사용자 정보 가져오기 오류',
        code = 401,
        error
    ) {
        this.message = message;
        this.code = code;
        this.error = error;
    }
};
/*
401 '비밀번호가 맞지 않습니다. (Unauthenticated)';
400 '유효하지 않은 Password입니다.(Bad Request)';
400 'parameter에 잘못된 데이터가 있습니다..(Bad Request)';
409 '이미 가입된 email입니다.(Conflict)';
401 '로그인 시도횟수를 초과했습니다. 비밀번호 찾기 기능을 사용해주세요 (Unauthenticated)';
404 '계정을 확인해주세요. (Not Found)';  // this.userExist = false;
401 '인증되지 않은 계정입니다. 발송된 메일 확인 후 인증 처리해주세요(Unauthenticated)';
403 '계정 비활성화 상태입니다. 관리자에게 문의해주세요';
403 '토큰이 만료되었습니다. (Forbidden)';    // this.isExpired = true;
401 '유효하지 않은 토큰입니다. (Unauthenticated)';    // this.logInRequired = true;
401 '토큰이 취소되었습니다. 로그인 서비스가 필요합니다.(Unauthorized)';   // this.logInRequired = true;
*/
